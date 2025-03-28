import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  refreshToken
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

type UserStateType = {
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  user: TUser | null;
  isLoading: boolean;
  error: string | undefined;
};

const initialState: UserStateType = {
  isAuthenticated: false,
  isAuthChecked: false,
  isLoading: false,
  error: undefined,
  user: null
};

const isPendingAction = (action: PayloadAction) =>
  action.type.endsWith('/pending');
const isRejectedAction = (action: PayloadAction) =>
  action.type.endsWith('/rejected');

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const result = await registerUserApi(data);

      setCookie('accessToken', result.accessToken);
      setCookie('refreshToken', result.refreshToken);
      return result.user;
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при регистрации');
    }
  }
);

export const fetchCheckAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      // Проверяем наличие хотя бы refreshToken (как индикатор возможной авторизации)
      const refreshTokenCookie = getCookie('refreshToken');
      if (!refreshTokenCookie) {
        return rejectWithValue('Не получен refresh-token ');
      }

      const accessToken = getCookie('accessToken');
      if (!accessToken) {
        const refreshData = await refreshToken();
        if (!refreshData.success) {
          throw new Error('Failed to refresh token');
        }
      }
      const response = await getUserApi();

      if (!response.success) {
        throw new Error('Failed to get user data');
      }

      return response.user;
    } catch (error) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      return rejectWithValue(error || 'Authentication error');
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(loginData);

      setCookie('accessToken', response.accessToken);
      setCookie('refreshToken', response.refreshToken);

      return response.user;
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при входе');
    }
  }
);

export const fetchLogoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = getCookie('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token found');
      }

      await logoutApi(refreshToken);

      deleteCookie('accessToken');
      deleteCookie('refreshToken');

      return true;
    } catch (error) {
      deleteCookie('accessToken');
      deleteCookie('refreshToken');
      return rejectWithValue(error || 'Ошибка при выходе');
    }
  }
);

export const fetchForgotPass = createAsyncThunk(
  'user/forgotPass',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(data);
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при запросе смены пароля');
    }
  }
);

export const fetchResetPass = createAsyncThunk(
  'user/resetPass',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при запросе сброса пароля');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/getUser',
  async (accessToken: string | undefined, { rejectWithValue }) => {
    try {
      const token = accessToken || getCookie('accessToken');
      const result = await getUserApi(token);
      return result.user;
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке пользователя');
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const result = await updateUserApi(user);
      return result.user;
    } catch (error) {
      return rejectWithValue(
        error || 'Ошибка при обновлении данных пользователя'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(fetchCheckAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(fetchCheckAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isAuthChecked = true;
        state.error = undefined;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = undefined;
      })
      .addMatcher(isPendingAction, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(isRejectedAction, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
export const { setAuthChecked } = userSlice.actions;
export default userSlice.reducer;
