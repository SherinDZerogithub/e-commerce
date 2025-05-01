import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/addNewProduct",
  async ({ filterParams, sortParams }) => {
    //create a queary
    const queary = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });
    // The await keyword indicates that the function will wait for the API call to complete before proceeding.
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${queary} `
    );
    return result?.data;
    //The optional chaining operator (?.) is used to safely access the data property, ensuring that
    //  if result is undefined or null, it won't throw an error.
  }
);
export const fetchProductsDetails = createAsyncThunk(
  "products/fetchProductsDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/shop/products/get/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product details"
      );
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Product Details
      .addCase(fetchProductsDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductsDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductsDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductDetails } = shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;
export const { setProductDetails } = shoppingProductSlice.actions;
