import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addNewReviews = createAsyncThunk(
  "/orders/addNewReviews",
  async (formdata) => {
    console.log("Sending review data to backend:", formdata); // <-- log here
    const response = await axios.post(
      `http://localhost:5000/api/shop/reviews/add`,
      formdata
    );

    return response.data;
  }
);

export const getReviews = createAsyncThunk(
  "/orders/getReviews",
  async (productId) => {
    console.log("Sending review data to backend:", productId); // <-- log here
    const response = await axios.get(
      `http://localhost:5000/api/shop/reviews/${productId}`
    );

    return response.data;
  }
);

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewReviews.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      })
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
