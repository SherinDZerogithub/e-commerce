import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orderList: [],
  orderDetails: null,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/orders/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/orders/get"
    );

    return response.data;
  }
);

export const getOrdersDetailsForAdmin = createAsyncThunk(
  "/orders/getOrdersDetailsForAdmin",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/orders/details/${id}`
    );

    return response.data;
  }
);

export const updateOrderStatsSlice = createAsyncThunk(
  "/orders/updateOrderStatsSlice",
  async ({ id, orderStatus }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }
);


const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrdersDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrdersDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrdersDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      })
      .addCase(updateOrderStatsSlice.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateOrderStatsSlice.fulfilled, (state, action) => {
        state.isLoading = false;
       
        console.log("✅ Order status updated:", action.payload);
      })
      .addCase(updateOrderStatsSlice.rejected, (state, action) => {
        state.isLoading = false;
        console.error(
          "❌ Failed to update order status:",
          action.error.message || action.error
        );
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
