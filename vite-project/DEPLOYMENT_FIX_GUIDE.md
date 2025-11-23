# Fix Guide: Booking Data Not Saving to Google Sheets

## Problem Identified
The `initSheet` action works (headers are created), but `saveBooking` action fails to save data rows.

## Root Causes
1. Google Apps Script may not be deployed with the latest version
2. Missing error handling and logging in the script
3. Data validation issues

## Solution Steps

### Step 1: Update Your Google Apps Script

1. **Open your Google Apps Script project**
   - Go to: https://script.google.com
   - Open your project (linked to spreadsheet ID: `1oR3FAaHWzoVYZtuQ5SAgR_4oT47Mqk6AP4XJ_u7FlkA`)

2. **Replace the entire script** with the updated version from `google-apps-script.js`
   - Copy ALL content from `google-apps-script.js`
   - Paste it into your Google Apps Script editor (replace everything)

3. **Save the script**
   - Click the disk icon or press `Ctrl+S` / `Cmd+S`

### Step 2: Deploy as New Version

**IMPORTANT**: You must create a NEW deployment for changes to take effect!

1. **Click "Deploy" → "New deployment"**

2. **Select type**: Web app

3. **Configuration**:
   - Description: "Fix booking save issue - v2"
   - Execute as: **Me** (your-email@gmail.com)
   - Who has access: **Anyone**

4. **Click "Deploy"**

5. **Authorize if prompted**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to [your project]"
   - Click "Allow"

6. **Copy the NEW Web App URL**
   - It should look like: `https://script.google.com/macros/s/AKfycbxd14gSma.../exec`
   - **This URL might be the same as before, but the script behind it is now updated**

### Step 3: Update Your .env File (Optional)

If you got a NEW Web App URL, update your `.env` file:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=<your-new-web-app-url>
```

If the URL is the same, no change needed! The script is updated behind the same URL.

### Step 4: Test the Fix

1. **Stop your development server** (if running)
   - Press `Ctrl+C` in the terminal

2. **Restart the server**
   ```bash
   npm run dev
   ```

3. **Make a test booking**
   - Go through the entire booking flow
   - Fill in all information
   - Click "Finish"

4. **Check the browser console** (F12)
   - Look for these log messages:
     ```
     🚀 sendConfirmationEmail function called!
     📋 Prepared booking data: {...}
     💾 Attempting to save booking to Google Sheets...
     📤 Sending JSONP request with params: {...}
     📥 Server response received: {...}
     ✅ Booking saved to Google Sheets successfully
     ```

5. **Check Google Sheets**
   - Open your spreadsheet
   - You should see a new row with all the booking data

### Step 5: Check Google Apps Script Execution Logs

If it still doesn't work:

1. **Go to Google Apps Script editor**
2. **Click "Executions" (clock icon on left sidebar)**
3. **Look at the most recent execution**
   - Status should be "Completed"
   - Click on it to see console logs
   - Look for error messages

**Expected logs**:
```
=== SAVE BOOKING STARTED ===
All params received: {...}
Processed booking data: {...}
Sheet initialization result: {...}
Sheet ready, saving booking...
=== saveBookingToSheet STARTED ===
Opening spreadsheet with ID: 1oR3FAaHWzoVYZtuQ5SAgR_4oT47Mqk6AP4XJ_u7FlkA
Spreadsheet opened successfully
Sheet found: YES
Current last row: 1
Row data to append: [...]
Appending row to sheet...
Row appended successfully
New last row: 2
Row formatted successfully
=== saveBookingToSheet COMPLETED ===
Save booking result: {"success":true,...}
=== SAVE BOOKING COMPLETED ===
```

## Troubleshooting

### Issue: "Permission denied" error
**Solution**: Re-authorize the script
- Go to Google Apps Script
- Run > testScript
- Authorize when prompted

### Issue: "Sheet not found" error
**Solution**: The sheet might have been deleted
- The script will auto-create it on next `initSheet` call
- Or manually create a sheet named "Bookings"

### Issue: Still no data saving
**Solution**: Check these:
1. Spreadsheet ID in script matches your actual spreadsheet
2. Web App URL in `.env` is correct
3. You deployed as a NEW version (not just saved)
4. Browser cache cleared (Ctrl+Shift+R)

### Issue: "URL too long" error
**Solution**: The data might be too long for URL parameters
- This is rare but possible
- Contact support if this happens

## Verification Checklist

- [ ] Updated Google Apps Script code
- [ ] Saved the script
- [ ] Created NEW deployment
- [ ] Copied Web App URL (if changed)
- [ ] Updated .env file (if URL changed)
- [ ] Restarted dev server
- [ ] Made test booking
- [ ] Checked browser console logs
- [ ] Checked Google Sheets for new row
- [ ] Checked Google Apps Script execution logs

## What Changed

### Enhanced Error Handling
- Added detailed logging at every step
- Validates data before saving
- Checks if row was actually appended
- Returns detailed error messages

### Better Data Validation
- Ensures all parameters are properly extracted
- Validates that data exists before appending
- Confirms sheet exists before writing

### Improved Logging
- Frontend logs show exact params being sent
- Backend logs show exact data being received
- Both sides log success/failure clearly

## Need More Help?

If you still have issues after following this guide:

1. **Share your console logs** from browser (F12 > Console)
2. **Share execution logs** from Google Apps Script
3. **Share a screenshot** of your Google Sheet (showing headers but no data)
4. **Confirm**: Did you create a NEW deployment or just save?

Most issues are solved by creating a **NEW deployment** rather than just saving!


