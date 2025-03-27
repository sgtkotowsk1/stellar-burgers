import { getOrderByNumberApi, orderBurgerApi } from '@api';
import {
  Action,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { newOrder, TOrder } from '@utils-types';

type OrderType = {
  name: string;
  isLoading: boolean;
  error: string | null;
  newOrder: newOrder | null;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: OrderType = {
  newOrder: null,
  name: '',
  isLoading: false,
  error: null,
  orderModalData: null,
  orderRequest: false
};

export const fetchOrderByNumber = createAsyncThunk(
  'orderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const result = await getOrderByNumberApi(number);
      return result.orders[0];
    } catch (error) {
      return rejectWithValue(error || 'Ошибка загрузки данных заказа');
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
      return rejectWithValue(error || 'Ошибка загрузки данных заказа');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload;
        state.orderRequest = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderBurger.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(fetchOrderBurger.fulfilled, (state, action) => {
        state.isLoading = false;
        state.newOrder = action.payload;
        state.orderRequest = false;
      })
      .addCase(fetchOrderBurger.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default orderSlice.reducer;
