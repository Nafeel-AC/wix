// Backend Server for Google Sheets Integration (Node.js + Express)
// Run this with: node backend-server.js
// This server should be deployed separately and handle the Google Sheets API securely

const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load service account credentials
const serviceAccount = require('./smooth-answer-471720-q7-75ba614aa16c.json');

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID || 'your_spreadsheet_id_here';

// Initialize Google Sheets API
const auth = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// Initialize Google Sheets with headers
app.post('/api/sheets/init', async (req, res) => {
  try {
    // Check if sheet exists and has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bookings!A1:O1'
    });

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers if they don't exist
      const headers = [
        'Timestamp',
        'Booking ID',
        'Service Type',
        'Package (Persons)',
        'Price (£)',
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Lender',
        'Solicitor',
        'Appointment Date',
        'Appointment Time',
        'Status',
        'Notes'
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Bookings!A1:O1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [headers]
        }
      });

      // Format headers
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        resource: {
          requests: [{
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: headers.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.2, green: 0.6, blue: 0.8 },
                  textFormat: {
                    foregroundColor: { red: 1, green: 1, blue: 1 },
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          }]
        }
      });
    }

    res.json({ success: true, message: 'Sheet initialized successfully' });
  } catch (error) {
    console.error('Error initializing sheet:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Save booking to Google Sheets
app.post('/api/bookings', async (req, res) => {
  try {
    const bookingData = req.body;
    
    const row = [
      bookingData.timestamp,
      bookingData.bookingId,
      bookingData.serviceType,
      `${bookingData.persons} Person${bookingData.persons > 1 ? 's' : ''}`,
      bookingData.price,
      bookingData.firstName,
      bookingData.lastName,
      bookingData.email,
      bookingData.phone,
      bookingData.lender,
      bookingData.solicitor,
      bookingData.appointmentDate,
      bookingData.appointmentTime,
      bookingData.status,
      '' // Notes
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bookings!A:O',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row]
      }
    });

    console.log('Booking saved to Google Sheets:', bookingData.bookingId);
    
    res.json({ 
      success: true, 
      bookingId: bookingData.bookingId,
      range: response.data.updates.updatedRange,
      message: 'Booking saved successfully to Google Sheets'
    });

  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all bookings from Google Sheets
app.get('/api/bookings', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Bookings!A:O'
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.json([]);
    }

    // Convert to objects (skip header row)
    const headers = rows[0];
    const bookings = rows.slice(1).map(row => {
      const booking = {};
      headers.forEach((header, index) => {
        booking[header.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')] = row[index] || '';
      });
      return booking;
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Google Sheets ID: ${SPREADSHEET_ID}`);
  console.log(`🔐 Using service account: ${serviceAccount.client_email}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

/*
To run this backend server:

1. Create package.json in the root directory:
{
  "name": "solicitor-booking-backend",
  "version": "1.0.0",
  "description": "Backend server for solicitor booking system",
  "main": "backend-server.js",
  "scripts": {
    "start": "node backend-server.js",
    "dev": "nodemon backend-server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "googleapis": "^129.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}

2. Install dependencies:
   npm install

3. Set environment variables:
   export GOOGLE_SHEETS_ID="your_actual_google_sheets_id"

4. Run the server:
   npm start

5. Update your .env file in the React app:
   VITE_BACKEND_URL=http://localhost:3001
*/
