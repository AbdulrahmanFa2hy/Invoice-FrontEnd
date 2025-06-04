import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL, UPLOADS_BASE_URL } from "../config/api.js";

// Configure axios defaults
axios.defaults.headers.common["Content-Type"] = "application/json";

// Helper function to convert base64 to file
const base64ToFile = async (base64String, filename = "logo.png") => {
  if (!base64String) return null;
  const response = await fetch(base64String);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};

// Helper function to construct logo URL
const getLogoUrl = (logoPath) => {
  if (!logoPath) return "";
  if (logoPath.startsWith("http")) {
    // If it's already a full URL, check if it's localhost and convert it
    if (
      logoPath.includes("localhost:3000") ||
      logoPath.includes("127.0.0.1:3000")
    ) {
      // Extract just the filename and rebuild with proper URL
      const fileName = logoPath.split("/").pop();
      return `${UPLOADS_BASE_URL}/${fileName}`;
    }
    return logoPath;
  }
  return `${UPLOADS_BASE_URL}/${logoPath}`;
};

// Helper function to format company data for API
const formatCompanyData = async (data) => {
  const formData = new FormData();

  // Add basic fields
  formData.append("name", data.name || "");
  formData.append("email", data.email || "");
  formData.append("phone", data.phone || "");
  formData.append("address", data.address || "");

  // Add explicit flag for logo deletion
  if (data.deleteLogo) {
    formData.append("deleteLogo", "true");
  }

  // Handle logo
  if (data.logo && !data.deleteLogo) {
    // Only process logo if it's not being deleted
    const logoFile = await base64ToFile(data.logo);
    if (logoFile) {
      formData.append("logo", logoFile);
    }
  }

  return formData;
};

// Thunk action to fetch company by user ID
export const fetchCompanyByUserId = createAsyncThunk(
  "company/fetchByUserId",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_BASE_URL}/companies`, {
        headers: {
          token: token,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Thunk action to save company (create or update)
export const saveCompany = createAsyncThunk(
  "company/save",
  async (companyData, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("Authentication token is required");
      }

      const formData = await formatCompanyData(companyData);
      const state = getState();
      const isNewCompany = !state.company.exists;

      console.log("Saving company data:", {
        isNewCompany,
        hasLogo: !!companyData.logo,
        deleteLogo: !!companyData.deleteLogo,
        apiUrl: `${API_BASE_URL}/companies`,
      });

      let response;

      if (isNewCompany) {
        response = await axios.post(`${API_BASE_URL}/companies`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          timeout: 30000, // 30 second timeout
        });
      } else {
        response = await axios.put(`${API_BASE_URL}/companies`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            token: token,
          },
          timeout: 30000, // 30 second timeout
        });
      }

      console.log("Company save successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Company save error:", error);

      // Handle network errors
      if (
        error.code === "NETWORK_ERROR" ||
        error.message === "Failed to fetch"
      ) {
        return rejectWithValue(
          "Network error. Please check your internet connection and try again."
        );
      }

      // Handle timeout errors
      if (error.code === "ECONNABORTED") {
        return rejectWithValue("Request timeout. Please try again.");
      }

      // Specifically handle 409 Conflict error
      if (error.response?.status === 409) {
        return rejectWithValue(
          "A company with this information already exists"
        );
      }

      // Handle authentication errors
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication failed. Please login again.");
      }

      // Handle CORS errors
      if (error.response?.status === 0) {
        return rejectWithValue(
          "Unable to connect to server. Please check if the backend is running."
        );
      }

      return rejectWithValue(
        error.response?.data?.message || error.message || "Error saving company"
      );
    }
  }
);

const initialState = {
  logo: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  exists: false,
  status: "idle",
  error: null,
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    updateCompany: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetCompany: () => {
      return initialState;
    },
    clearCachedLogo: (state) => {
      // Clear any localhost URLs from cached data
      if (
        state.logo &&
        (state.logo.includes("localhost") || state.logo.includes("127.0.0.1"))
      ) {
        state.logo = "";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanyByUserId.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCompanyByUserId.fulfilled, (state, action) => {
        if (action.payload === null) {
          Object.assign(state, { ...initialState, status: "succeeded" });
        } else {
          const companyData = action.payload.company;
          Object.assign(state, {
            ...companyData,
            logo: getLogoUrl(companyData.logo),
            exists: true,
            status: "succeeded",
            error: null,
          });
        }
      })
      .addCase(fetchCompanyByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch company";
      })
      .addCase(saveCompany.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(saveCompany.fulfilled, (state, action) => {
        const companyData = action.payload.company;
        Object.assign(state, {
          ...companyData,
          logo: getLogoUrl(companyData.logo),
          exists: true,
          status: "succeeded",
          error: null,
        });
      })
      .addCase(saveCompany.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to save company";
      });
  },
});

export const { updateCompany, resetCompany, clearCachedLogo } =
  companySlice.actions;
export default companySlice.reducer;
