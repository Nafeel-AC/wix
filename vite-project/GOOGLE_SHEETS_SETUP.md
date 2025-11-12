# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for the Solicitor Booking System using Google Apps Script.

## 🎯 Overview

Instead of calling Google Sheets API directly from the browser (which has CORS and security issues), we use Google Apps Script as a secure backend service that handles all Google Sheets operations.

## 📋 Step-by-Step Setup

### Step 1: Create Google Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Replace the default code with the content from `google-apps-script.js`
4. Save the project with a name like "Solicitor Booking Backend"

### Step 2: Configure the Script

1. In the script, make sure the `SPREADSHEET_ID` matches your Google Sheets ID:
   ```javascript
   const SPREADSHEET_ID = '1oR3FAaHWzoVYZtuQ5SAgR_4oT47Mqk6AP4XJ_u7FlkA';
   ```

### Step 3: Deploy as Web App

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as the type
3. Set the following configuration:
   - **Execute as**: Me (your Google account)
   - **Who has access**: Anyone
4. Click "Deploy"
5. Copy the **Web app URL** that's generated

### Step 4: Update Your .env File

Add the Web app URL to your `.env` file:

```env
# Google Apps Script Web App URL (for Google Sheets integration)
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual script ID from your deployment URL.

### Step 5: Test the Integration

1. Run your React app: `npm run dev`
2. Complete a booking through the system
3. Check your Google Sheets - the booking should appear automatically!
4. Check the browser console for success messages

## 🔧 What the Script Does

The Google Apps Script handles:

- **Sheet Initialization**: Creates "Bookings" sheet with proper headers and formatting
- **Data Storage**: Saves booking data securely to Google Sheets
- **Data Retrieval**: Fetches existing bookings (if needed)
- **Error Handling**: Provides proper error responses

## 📊 Google Sheets Structure

The script creates a "Bookings" sheet with these columns:

| Column | Description |
|--------|-------------|
| Timestamp | When the booking was made |
| Booking ID | Unique identifier (BK-XXXXX-XXXXX) |
| Service Type | Selected service |
| Package | Number of persons |
| Price | Total cost in £ |
| First Name | Client's first name |
| Last Name | Client's last name |
| Email | Client's email address |
| Phone | Client's phone number |
| Lender | Selected lender |
| Solicitor | Assigned solicitor |
| Appointment Date | Selected date |
| Appointment Time | Selected time slot |
| Status | Booking status (Confirmed) |
| Notes | Additional notes (empty by default) |

## 🛡️ Security Features

- **Service Account**: Uses your Google account credentials
- **Server-Side Processing**: All API calls happen on Google's servers
- **No CORS Issues**: Eliminates browser cross-origin problems
- **Secure Authentication**: No credentials exposed in frontend code

## 🐛 Troubleshooting

### Common Issues:

1. **Permission Denied**
   - Make sure the script is deployed with "Execute as: Me"
   - Ensure you have edit access to the Google Sheet

2. **CORS Errors**
   - The Google Apps Script should handle this automatically
   - Make sure the deployment is set to "Anyone" access

3. **Script Not Found**
   - Verify the Web App URL is correct in your .env file
   - Check that the deployment is active

4. **Data Not Appearing**
   - Check the browser console for error messages
   - Verify the SPREADSHEET_ID in the script matches your sheet
   - Test the script using the `testScript()` function

### Testing the Script:

You can test the Google Apps Script directly:

1. In the Apps Script editor, select the `testScript` function
2. Click "Run" to execute it
3. Check the "Execution transcript" for results
4. Verify test data appears in your Google Sheet

## 🔄 Demo Mode vs Live Mode

- **Demo Mode** (default): Shows booking data in browser console
- **Live Mode**: Saves data to Google Sheets when Web App URL is configured

To switch from demo to live mode, simply add the `VITE_GOOGLE_APPS_SCRIPT_URL` to your `.env` file.

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify all configuration steps were completed
3. Test the Google Apps Script independently
4. Ensure your Google Sheet permissions are correct

The system will show helpful console messages indicating whether it's running in demo mode or successfully connected to Google Sheets.
