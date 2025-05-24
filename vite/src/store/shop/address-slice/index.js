import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  addressList: [],
};


export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/address/add",
      formData
    );

    return response.data;
  }
);
export const fethAllAddress = createAsyncThunk(
  "/address/fethAllAddress",
  async (userId) => {
    //form data-> the address data from our front end
    const response = await axios.get(
      `http://localhost:5000/api/shop/address/get/${userId}`
    );

    return response.data;
  }
);

export const editAddress = createAsyncThunk(
  "/address/editAddress ",
  async ({ userId, addressId, formData }) => {
    //form data-> the address data from our front end
    const response = await axios.put(
      `http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
      formData
    );

    return response.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "/address/deleteAddress",
  async ({ userId, addressId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
    );

    return response.data;
  }
);

const addressSlice = createSlice({
  name: "addressSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fethAllAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fethAllAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data; // <-- important
      })

      .addCase(fethAllAddress.rejected, (state) => {
        state.isLoading = false;
        state.addressList = [];
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(deleteAddress.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(editAddress.rejected, (state) => {
        state.isLoading = false;
        
      });

    
  },
});

export default addressSlice.reducer;
