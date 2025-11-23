# QUICK FIX - 5 Steps to Fix Booking Save Issue

## 🚨 CRITICAL: You MUST create a NEW deployment, not just save!

### Step 1: Copy Updated Script
1. Open `google-apps-script.js` in this project
2. Copy **ALL** the code (Ctrl+A, Ctrl+C)

### Step 2: Update Google Apps Script
1. Go to https://script.google.com
2. Open your existing project
3. Select all code and paste the new code (replace everything)
4. Click **Save** (💾 icon)

### Step 3: Create NEW Deployment ⚠️ IMPORTANT
1. Click **Deploy** → **New deployment**
2. Click gear icon ⚙️ → Select type: **Web app**
3. Fill in:
   - Description: "Fix v2"
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** (if prompted)
6. Click **Done**

**Note**: The URL will likely be the same, but the script behind it is now updated!

### Step 4: Restart Your App
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 5: Test
1. Make a test booking (fill all fields)
2. Click "Finish"
3. Open browser console (F12)
4. Look for: `✅ Booking saved to Google Sheets successfully`
5. Check your Google Sheet - you should see the data!

## If It Still Doesn't Work

Check **Google Apps Script Executions**:
1. In Google Apps Script editor, click ⏱️ **Executions** (left sidebar)
2. Click on the most recent execution
3. Look at the logs - they will tell you exactly what went wrong

## Common Mistake
❌ Just clicking "Save" in Google Apps Script editor
✅ Creating a **NEW deployment** via Deploy → New deployment

The script must be **deployed**, not just saved!


