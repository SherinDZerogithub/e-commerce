import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  cartItems: [],
  cartItem: [],
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/cart/add",
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);


export const fetchToCart = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    // Changed parameter structure
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const response = await axios.get(
        `http://localhost:5000/api/shop/cart/get/${userId}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/cart/${userId}/${productId}`
    );

    return response.data;
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }) => {
    const response = await axios.put(
      "http://localhost:5000/api/shop/cart/update-cart",
      {
        userId,
        productId,
        quantity,
      }
    );

    return response.data;
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingcart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.cartItem = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.cartItem = [];
      })
      .addCase(fetchToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.cartItem = action.payload.data;
      })

      .addCase(fetchToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.cartItem = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.cartItem = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.cartItem = [];
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
        state.cartItem = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = [];
        state.cartItem = [];
      });
  },
});

export default shoppingCartSlice.reducer;
