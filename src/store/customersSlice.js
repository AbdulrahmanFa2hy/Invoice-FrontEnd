import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../config/api.js";

// Add Customer Thunk
export const addCustomer = createAsyncThunk(
  "customers/addCustomer",
  async (customerData, { getState, rejectWithValue }) => {
    try {
      const userId = getState().profile.userData?.id;
      const token = localStorage.getItem("token");

      if (!userId) {
        return rejectWithValue({ message: "User ID not found" });
      }

      if (!token) {
        return rejectWithValue({ message: "Authentication token is required" });
      }

      console.log("Adding customer:", customerData);

      const response = await axios.post(
        `${API_BASE_URL}/customers`,
        {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          user_id: userId,
        },
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Customer added successfully:", response.data);
      return response.data.customer;
    } catch (error) {
      console.error("Error adding customer:", error);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Update Customer Thunk
export const updateCustomerThunk = createAsyncThunk(
  "customers/updateCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Authentication token is required" });
      }

      const response = await axios.put(
        `${API_BASE_URL}/customers/${customerData._id}`,
        {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
        },
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.customer;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Delete Customer Thunk
export const deleteCustomerThunk = createAsyncThunk(
  "customers/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue({ message: "Authentication token is required" });
      }

      await axios.delete(`${API_BASE_URL}/customers/${customerId}`, {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });
      return customerId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Fetch Customers Thunk
export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const userId = state.profile.userData?.id;
      const token = localStorage.getItem("token");

      if (!userId) {
        return rejectWithValue("User ID not found");
      }

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      console.log(`Fetching customers for user: ${userId}`);

      const response = await axios.get(`${API_BASE_URL}/customers/${userId}`, {
        headers: {
          token: token,
          "Content-Type": "application/json",
        },
      });

      console.log("Customers response:", response.data);
      return response.data.customers || [];
    } catch (error) {
      console.error("Error in fetchCustomers:", error);
      // If it's a 404, return empty array instead of rejecting
      if (error.response?.status === 404) {
        console.log("No customers found, returning empty array");
        return [];
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch customers"
      );
    }
  }
);

const initialState = {
  customers: [],
  selectedCustomerId: null,
  status: "idle",
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setSelectedCustomerId: (state, action) => {
      state.selectedCustomerId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Customer cases
      .addCase(addCustomer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers.push(action.payload.customer);
        state.error = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Customer cases
      .addCase(updateCustomerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCustomerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.customers.findIndex(
          (customer) => customer._id === action.payload._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCustomerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Delete Customer cases
      .addCase(deleteCustomerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteCustomerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = state.customers.filter(
          (customer) => customer._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteCustomerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Fetch Customers cases
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setSelectedCustomerId } = customersSlice.actions;

export default customersSlice.reducer;
