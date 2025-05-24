import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  userDetails: null,
};

export const getAllUsers = createAsyncThunk(
  "/orders/getAllOrdersForAdmin",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/orders/get"
    );

    return response.data;
  }
);






const adminUserSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.data;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userDetails = [];
      })
     
  },
});


export default adminUserSlice .reducer;
