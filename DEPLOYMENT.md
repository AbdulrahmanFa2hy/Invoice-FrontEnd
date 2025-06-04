# Frontend Deployment Guide

## Overview

This React frontend is configured to work with the Railway-deployed backend. The API URLs are centralized in `src/config/api.js` for easy management.

## Environment Variables

Create a `.env` file in the root of the FrontEnd directory with:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api/v1

# Uploads Base URL
VITE_UPLOADS_BASE_URL=https://your-railway-backend-url.railway.app/uploads
```

**Note:** Replace `your-railway-backend-url` with your actual Railway backend URL.

## Recent Fixes Applied

### API Integration Issues Fixed:

1. **Customer Creation Error**: Fixed missing `user_id` field in customer creation requests
2. **Data Fetching Order**: Fixed timing issues where data fetching occurred before user authentication
3. **404 Error Handling**: Added graceful handling of 404 responses for customers and products
4. **Logo URL Issues**: Fixed localhost URL issues in cached company logo data
5. **Axios Configuration**: Removed conflicting base URL settings

### Data Clearing on Logout:

- Enhanced logout function to clear all cached data including company information
- This resolves issues with old logo URLs pointing to localhost

## Troubleshooting

### If you see localhost URLs in error logs:

1. Log out and log back in to clear cached data
2. This will refresh all company logos and API endpoints

### If you get "User ID not found" errors:

- Ensure you're logged in properly
- The app now waits for authentication before making API calls

### 500 Errors on Customer/Product Creation:

- Check that your Railway backend is properly deployed
- Verify environment variables are set correctly

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

## Configuration Changes Made

### 1. Centralized API Configuration

- All API URLs are now in `src/config/api.js`
- Easy to change backend URL in one place
- Supports environment variables for different environments

### 2. React Router Future Flags

- Added `v7_startTransition` and `v7_relativeSplatPath` flags
- Eliminates React Router warnings

### 3. Auto-focus Removed

- Removed auto-focus from product name inputs
- Better UX on page load/refresh

### 4. Enhanced Error Handling

- Graceful handling of 404 responses
- Better error messages for debugging
- Proper data fetching order

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
