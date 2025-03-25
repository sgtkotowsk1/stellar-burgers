import { getOrderByNumberApi, orderBurgerApi } from '@api';
import {
  Action,
  AnyAction,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { newOrder, TOrder } from '@utils-types';

type OrderType = {
  order: TOrder | undefined;
  name: string;
  isLoading: boolean;
  error: string | null;
  newOrder: newOrder | undefined;
};

const initialState: OrderType = {
  newOrder: undefined,
  order: undefined,
  name: '',
  isLoading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const result = await getOrderByNumberApi(number);
      return result.orders[0];
    } catch (error) {
      rejectWithValue(error || 'Ошибка загрузки данных заказа');
    }
  }
);

export const fetchOrderBurger = createAsyncThunk(
  'orderBurger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const result = await orderBurgerApi(data);
      return { order: result.order, name: result.name };
    } catch (error) {
      rejectWithValue(error || 'Ошибка загрузки данных заказа');
    }
  }
);

const isPendingAction = (action: Action) => action.type.endsWith('/pending');

const isRejectedAction = (action: Action) => action.type.endsWith('/rejected');

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newOrder = action.payload;
      })
      .addMatcher(isPendingAction, (state) => {
        state.isLoading = true;
      })
      .addMatcher(isRejectedAction, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default orderSlice.reducer;
