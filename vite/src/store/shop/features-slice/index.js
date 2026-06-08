import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureList: [],
};

export const fetchShopFeatures = createAsyncThunk(
  "shopFeatures/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/shop/features/get");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch banners");
    }
  }
);

const shopFeaturesSlice = createSlice({
  name: "shopFeatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShopFeatures.pending, (state) => { state.isLoading = true; })
      .addCase(fetchShopFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureList = action.payload.data;
      })
      .addCase(fetchShopFeatures.rejected, (state) => {
        state.isLoading = false;
        state.featureList = [];
      });
  },
});

export default shopFeaturesSlice.reducer;
