import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi, TNewOrder } from '@api';
import { TOrder } from '@utils-types';

type TOrderState = {
  orderModalData: TNewOrder | null;
  orderRequest: boolean;
  orderData: TOrder | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  orderData: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderData = action.payload;
      });
  }
});

export const { clearOrderModalData } = orderSlice.actions;
export default orderSlice.reducer;
