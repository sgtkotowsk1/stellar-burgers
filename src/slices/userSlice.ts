import {
  TRegisterData,
  registerUserApi,
  TLoginData,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

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
  'register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const result = await registerUserApi(data);
      return result;
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при регистрации');
    }
  }
);

export const fetchLoginUser = createAsyncThunk(
  'login',
  async (loginData: TLoginData, { rejectWithValue }) => {
    try {
      const result = await loginUserApi(loginData);
      return result;
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при входе');
    }
  }
);

export const fetchLogoutUser = createAsyncThunk(
  'logout',
  async (_, { rejectWithValue }) => {
    try {
      return await logoutApi();
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при выходе');
    }
  }
);

export const fetchForgotPass = createAsyncThunk(
  'forgotPass',
  async (data: { email: string }, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(data);
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при запросе смены пароля');
    }
  }
);

export const fetchResetPass = createAsyncThunk(
  'resetPass',
  async (data: { password: string; token: string }, { rejectWithValue }) => {
    try {
      await resetPasswordApi(data);
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при запросе сброса пароля');
    }
  }
);

export const fetchUser = createAsyncThunk(
  'getUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await getUserApi();
      return result;
    } catch (error) {
      return rejectWithValue(error || 'Ошибка при загрузке пользователя');
    }
  }
);

export const fetchUpdateUser = createAsyncThunk(
  'updateUser',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const result = await updateUserApi(user);
      return result;
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
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(fetchLogoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addMatcher(isPendingAction, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(isRejectedAction, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});
export default userSlice.reducer;
