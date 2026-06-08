import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE = "http://localhost:5000/api/admin/features";

const initialState = {
  isLoading: false,
  featureList: [],
  error: null,
};

export const fetchAdminFeatures = createAsyncThunk(
  "adminFeatures/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE}/get`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch features");
    }
  }
);

export const addAdminFeature = createAsyncThunk(
  "adminFeatures/add",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE}/add`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add feature");
    }
  }
);

export const editAdminFeature = createAsyncThunk(
  "adminFeatures/edit",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE}/edit/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to edit feature");
    }
  }
);

export const deleteAdminFeature = createAsyncThunk(
  "adminFeatures/delete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`${BASE}/delete/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete feature");
    }
  }
);

const adminFeaturesSlice = createSlice({
  name: "adminFeatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchAdminFeatures.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchAdminFeatures.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureList = action.payload.data;
      })
      .addCase(fetchAdminFeatures.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // add
      .addCase(addAdminFeature.pending, (state) => { state.isLoading = true; })
      .addCase(addAdminFeature.fulfilled, (state) => { state.isLoading = false; })
      .addCase(addAdminFeature.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // edit
      .addCase(editAdminFeature.pending, (state) => { state.isLoading = true; })
      .addCase(editAdminFeature.fulfilled, (state) => { state.isLoading = false; })
      .addCase(editAdminFeature.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      // delete
      .addCase(deleteAdminFeature.pending, (state) => { state.isLoading = true; })
      .addCase(deleteAdminFeature.fulfilled, (state) => { state.isLoading = false; })
      .addCase(deleteAdminFeature.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export default adminFeaturesSlice.reducer;
