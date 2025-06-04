# Frontend Deployment Guide

## Overview

This React frontend is configured to work with the Railway-deployed backend. The API URLs are centralized in `src/config/api.js` for easy management.

## 🛠️ Recent Critical Fixes Applied (Latest Update)

### 1. **Fixed "Cannot convert undefined or null to object" Error**

- **Issue**: `Object.values()` was being called on null/undefined customer objects
- **Fix**: Added proper null checks and defensive programming in `Customers.jsx` and `Invoices.jsx`
- **Files Modified**:
  - `src/pages/Customers.jsx` (lines 274-284)
  - `src/pages/Invoices.jsx` (lines 299-310)

### 2. **Fixed Localhost Logo URL Issues**

- **Issue**: Company logos were cached with localhost:3000 URLs causing connection refused errors
- **Fix**: Enhanced `getLogoUrl()` function to detect and convert localhost URLs to production URLs
- **Files Modified**:
  - `src/store/companySlice.js` (lines 28-38)
  - Added `clearCachedLogo` action to clear problematic URLs

### 3. **Fixed Customer Creation Response Handling**

- **Issue**: `addCustomer.fulfilled` was trying to access `payload.customer` when payload was already the customer object
- **Fix**: Corrected the reducer to use `action.payload` directly
- **Files Modified**:
  - `src/store/customersSlice.js` (line 157)

### 4. **Enhanced Company Save Error Handling**

- **Issue**: "Failed to fetch" errors with no helpful debugging information
- **Fix**: Added comprehensive error handling for network, timeout, CORS, and authentication errors
- **Files Modified**:
  - `src/store/companySlice.js` (lines 85-125)

### 5. **Improved Backend CORS Configuration**

- **Issue**: CORS errors preventing frontend-backend communication
- **Fix**: Enhanced CORS configuration with explicit origins, methods, and headers
- **Files Modified**:
  - `BackEnd/index.js` (lines 17-30)

### 6. **Added Automatic Cache Clearing**

- **Issue**: Cached localhost URLs persisting across sessions
- **Fix**: Added automatic cache clearing on app startup and logout
- **Files Modified**:
  - `src/pages/Home.jsx` (added `clearCachedLogo` dispatch)
  - `src/pages/Profile.jsx` (enhanced logout function)

## Environment Variables

Create a `.env` file in the root of the FrontEnd directory with:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api/v1

# Uploads Base URL
VITE_UPLOADS_BASE_URL=https://your-railway-backend-url.railway.app/uploads
```

**Note:** Replace `your-railway-backend-url` with your actual Railway backend URL.

## Troubleshooting

### If you see localhost URLs in error logs:

1. Log out and log back in to clear cached data
2. This will refresh all company logos and API endpoints
3. Clear browser cache if issues persist
4. Check that environment variables are properly set in your deployment platform

### If you get "User ID not found" errors:

- Ensure you're logged in properly
- The app now waits for authentication before making API calls

### If you see "Cannot convert undefined or null to object" errors:

- This was a filtering issue that has been fixed
- The app now handles null/undefined customer and invoice objects gracefully
- Clear browser cache and refresh the application

### 500 Errors on Customer/Product Creation:

- Check that your Railway backend is properly deployed
- Verify environment variables are set correctly
- Ensure CORS is properly configured on the backend

### Company Save "Failed to fetch" errors:

- Check backend CORS configuration
- Verify the backend URL is accessible
- Check browser network tab for detailed error information
- Ensure proper authentication tokens are being sent

## Deployment Options

### Option 1: Netlify (Recommended)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA routing

### Option 2: Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Option 3: Railway (Static Site)

1. Create a new Railway project
2. Connect your GitHub repository
3. Set environment variables
4. Deploy the frontend as a static site

## Build Command

```bash
npm run build
```

## Environment Variables Reference

- `VITE_API_BASE_URL`: Backend API base URL (defaults to Railway production URL)
- `VITE_UPLOADS_BASE_URL`: Backend uploads URL (defaults to Railway production URL)

## Features

- Invoice generation and management
- Customer and product management
- Company profile management
- PDF generation and download
- Multi-language support (English/Arabic)
- Responsive design
