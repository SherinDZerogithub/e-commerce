import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  timeline: [],       // [{month, revenue, orders, signups}]
  topProducts: [],    // [{_id, title, image, totalSold, totalRevenue}]
  ordersByStatus: [], // [{_id, count}]
  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
  },
  error: null,
};

export const fetchAnalytics = createAsyncThunk(
  "adminAnalytics/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/analytics",
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load analytics"
      );
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        const { timeline, topProducts, ordersByStatus, summary } =
          action.payload.data;
        state.timeline = timeline;
        state.topProducts = topProducts;
        state.ordersByStatus = ordersByStatus;
        state.summary = summary;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default adminAnalyticsSlice.reducer;
