/**
 * Google Apps Script for Solicitor Booking System
 * 
 * This script acts as a secure backend to handle Google Sheets operations
 * Deploy this as a Web App with execution as "Me" and access to "Anyone"
 */

// Configuration
const SPREADSHEET_ID = '1oR3FAaHWzoVYZtuQ5SAgR_4oT47Mqk6AP4XJ_u7FlkA'; // Your Google Sheets ID
const SHEET_NAME = 'Bookings';

/**
 * Main function to handle HTTP requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    let result;
    
    switch (data.action) {
      case 'initSheet':
        result = initializeSheet();
        break;
      
      case 'saveBooking':
        result = saveBookingToSheet(data.data);
        break;
      
      default:
        throw new Error('Unknown action: ' + data.action);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('doPost error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests with robust error handling and JSONP support
 */
function doGet(e) {
  console.log('doGet called with event:', e);
  
  // Define shared variables so they're available in catch block too
  let params = {};
  let action = 'test';
  let callback = null;
  let result;
  
  try {
    // Safely get parameters with fallback
    params = (e && e.parameter) ? e.parameter : {};
    action = params.action || 'test';
    callback = params.callback || null;
    
    console.log('Action:', action);
    console.log('Parameters:', params);
    
    switch (action) {
      case 'test':
        result = { 
          success: true, 
          message: 'Google Apps Script is working!',
          timestamp: new Date().toISOString()
        };
        break;
      
      case 'initSheet':
        console.log('Initializing sheet...');
        result = initializeSheet();
        break;
        
      case 'saveBooking':
        console.log('Saving booking with params:', params);
        // Extract booking data from URL parameters with validation
        const bookingData = {
          timestamp: params.timestamp || new Date().toLocaleString('en-GB'),
          bookingId: params.bookingId || ('BK-' + Date.now()),
          serviceType: params.serviceType || 'Unknown Service',
          persons: parseInt(params.persons) || 1,
          price: params.price || '0.00',
          firstName: params.firstName || '',
          lastName: params.lastName || '',
          email: params.email || '',
          phone: params.phone || '',
          lender: params.lender || '',
          solicitor: params.solicitor || '',
          appointmentDate: params.appointmentDate || '',
          appointmentTime: params.appointmentTime || '',
          status: params.status || 'Confirmed'
        };
        console.log('Processed booking data:', bookingData);
        result = saveBookingToSheet(bookingData);
        break;
      
      case 'getBookings':
        console.log('Getting bookings...');
        result = getBookings();
        break;
      
      default:
        console.log('Unknown action:', action);
        result = { 
          success: false, 
          error: 'Unknown action: ' + action,
          availableActions: ['test', 'initSheet', 'saveBooking', 'getBookings']
        };
    }
    
    console.log('Result:', result);
    
    // Support both JSONP and regular JSON
    if (callback) {
      console.log('Returning JSONP response with callback:', callback);
      // JSONP bypasses CORS completely - no headers needed
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      console.log('Returning regular JSON response');
      // Plain JSON response (CORS handled by Apps Script deployment settings)
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    console.error('doGet error:', error);
    console.error('Error stack:', error.stack);
    
    const errorResult = { 
      success: false, 
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    // Try to get callback safely (fallback if not already set)
    if (!callback && e && e.parameter && e.parameter.callback) {
      callback = e.parameter.callback;
    }

    if (callback) {
      console.log('Returning JSONP error response');
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(errorResult) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      console.log('Returning regular JSON error response');
      return ContentService
        .createTextOutput(JSON.stringify(errorResult))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}

/**
 * Handle OPTIONS requests (CORS preflight)
 * Note: Not needed for JSONP, but kept for compatibility
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Initialize the bookings sheet with headers
 */
function initializeSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Check if headers already exist
    const range = sheet.getRange(1, 1, 1, 15);
    const existingHeaders = range.getValues()[0];
    
    if (existingHeaders.every(header => header === '')) {
      // Add headers
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
      
      range.setValues([headers]);
      
      // Format headers
      range.setBackground('#3366CC');
      range.setFontColor('#FFFFFF');
      range.setFontWeight('bold');
      
      // Set column widths
      sheet.setColumnWidth(1, 150); // Timestamp
      sheet.setColumnWidth(2, 120); // Booking ID
      sheet.setColumnWidth(3, 180); // Service Type
      sheet.setColumnWidth(4, 120); // Package
      sheet.setColumnWidth(5, 80);  // Price
      sheet.setColumnWidth(6, 100); // First Name
      sheet.setColumnWidth(7, 100); // Last Name
      sheet.setColumnWidth(8, 200); // Email
      sheet.setColumnWidth(9, 120); // Phone
      sheet.setColumnWidth(10, 150); // Lender
      sheet.setColumnWidth(11, 120); // Solicitor
      sheet.setColumnWidth(12, 120); // Date
      sheet.setColumnWidth(13, 100); // Time
      sheet.setColumnWidth(14, 80);  // Status
      sheet.setColumnWidth(15, 200); // Notes
    }
    
    return {
      success: true,
      message: 'Sheet initialized successfully'
    };
  } catch (error) {
    console.error('initializeSheet error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Save booking data to the sheet
 */
function saveBookingToSheet(bookingData) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Bookings sheet not found. Please initialize first.');
    }
    
    // Prepare row data
    const row = [
      bookingData.timestamp,
      bookingData.bookingId,
      bookingData.serviceType,
      `${bookingData.persons} Person${bookingData.persons > 1 ? 's' : ''}`,
      `£${bookingData.price}`,
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
    
    // Append the row
    sheet.appendRow(row);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    const range = sheet.getRange(lastRow, 1, 1, 15);
    
    // Alternate row colors
    if (lastRow % 2 === 0) {
      range.setBackground('#F2F2F2');
    }
    
    // Set borders
    range.setBorder(true, true, true, true, false, false);
    
    return {
      success: true,
      message: 'Booking saved successfully',
      bookingId: bookingData.bookingId,
      row: lastRow
    };
  } catch (error) {
    console.error('saveBookingToSheet error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get all bookings from the sheet
 */
function getBookings() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return [];
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return []; // Only headers or empty
    }
    
    const headers = data[0];
    const bookings = [];
    
    // Convert rows to objects (skip header row)
    for (let i = 1; i < data.length; i++) {
      const booking = {};
      headers.forEach((header, index) => {
        const key = header.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[()£]/g, '');
        booking[key] = data[i][index] || '';
      });
      bookings.push(booking);
    }
    
    return bookings;
  } catch (error) {
    console.error('getBookings error:', error);
    return [];
  }
}

/**
 * Test function for debugging
 */
function testScript() {
  console.log('Testing Google Apps Script...');
  
  // Test initialization
  const initResult = initializeSheet();
  console.log('Init result:', initResult);
  
  // Test saving a booking
  const testBooking = {
    timestamp: new Date().toLocaleString('en-GB'),
    bookingId: 'BK-TEST-001',
    serviceType: 'Bridging Finance',
    persons: 1,
    price: '150.00',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+44 1234 567890',
    lender: 'Test Bank',
    solicitor: 'Dennis Brewer',
    appointmentDate: '15. November 2024',
    appointmentTime: '10:00 - 10:15',
    status: 'Confirmed'
  };
  
  const saveResult = saveBookingToSheet(testBooking);
  console.log('Save result:', saveResult);
  
  // Test getting bookings
  const bookings = getBookings();
  console.log('Bookings:', bookings);
}
