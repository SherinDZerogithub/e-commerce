import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  userDetails: [], 
  error: null, 
};

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await axios.post(
      "/api/auth/register",
      formData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        formData,
        {
          withCredentials: true,
        }
      );

      // store token in localStorage and set default Authorization header
      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { success: false, message: "Login failed" });
    }
  }
);

export const logOutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    // Clear token from localStorage and axios headers
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];

    return response.data;
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async (_, { rejectWithValue }) => {
    // include token from localStorage if available
    const token = localStorage.getItem("token");
    const headers = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const response = await axios.get("/api/auth/check-auth", {
        withCredentials: true,
        headers,
      });
      return response.data;
    } catch (error) {
      // Clear stale token on 401 so the user is redirected to login cleanly
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
      }
      return rejectWithValue(error.response?.data || { success: false });
    }
  }
);
export const getAllUsersAuth = createAsyncThunk(
  "/auth/getAllUsersAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/get", {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(getAllUsersAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsersAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetails = action.payload.users || [];
      })
      .addCase(getAllUsersAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.userDetails = [];
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
