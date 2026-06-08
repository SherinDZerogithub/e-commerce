import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/shop/recommendations";

// Track a product view (fire-and-forget; we swallow errors silently)
export const trackProductView = createAsyncThunk(
  "recommendations/trackView",
  async ({ userId, productId }) => {
    await axios.post(`${BASE}/track`, { userId, productId });
  }
);

// Fetch personalised recommendations for the logged-in user
export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetch",
  async ({ userId, limit = 8 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/${userId}?limit=${limit}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recommendations"
      );
    }
  }
);

// Fetch products similar to a given product (for product detail page)
export const fetchSimilarProducts = createAsyncThunk(
  "recommendations/fetchSimilar",
  async ({ productId, limit = 6 }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/similar/${productId}?limit=${limit}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch similar products"
      );
    }
  }
);

const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState: {
    recommendations: [],
    similarProducts: [],
    isLoading: false,
    similarLoading: false,
    error: null,
  },
  reducers: {
    clearSimilarProducts(state) {
      state.similarProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Personalised recommendations
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.recommendations = action.payload.data || [];
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarLoading = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarProducts = action.payload.data || [];
      })
      .addCase(fetchSimilarProducts.rejected, (state) => {
        state.similarLoading = false;
        state.similarProducts = [];
      });
  },
});

export const { clearSimilarProducts } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;
