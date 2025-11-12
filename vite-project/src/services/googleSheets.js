// Google Sheets integration using Google Apps Script Web App with JSONP (CORS-free)
class GoogleSheetsService {
  constructor() {
    // You'll need to create a Google Apps Script web app and deploy it
    this.webAppUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || ''
    this.isDemo = !this.webAppUrl
    
    console.log('🔧 GoogleSheetsService initialized:')
    console.log('  - Web App URL:', this.webAppUrl || '(not set)')
    console.log('  - Demo mode:', this.isDemo)
  }

  /**
   * Make a JSONP request (bypasses CORS completely)
   */
  async makeJSONPRequest(params = {}) {
    return new Promise((resolve, reject) => {
      if (this.isDemo) {
        console.log('📋 Demo mode: Simulating JSONP request')
        setTimeout(() => resolve({ success: true, message: 'Demo mode response' }), 100)
        return
      }

      // Generate unique callback name
      const callbackName = 'jsonp_callback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)
      
      // Add callback parameter
      const urlParams = new URLSearchParams({
        ...params,
        callback: callbackName
      })
      
      const scriptUrl = `${this.webAppUrl}?${urlParams.toString()}`
      
      console.log('🔗 Making JSONP request to:', scriptUrl)
      console.log('📋 Parameters:', params)
      
      // Create script element
      const script = document.createElement('script')
      script.src = scriptUrl
      
      // Setup global callback function
      window[callbackName] = (data) => {
        console.log('✅ JSONP callback received:', data)
        // Cleanup
        try { document.head.removeChild(script) } catch(e) {}
        delete window[callbackName]
        resolve(data)
      }
      
      // Handle errors
      script.onerror = (error) => {
        console.error('❌ JSONP script error:', error)
        console.error('Failed URL:', scriptUrl)
        // Cleanup
        try { document.head.removeChild(script) } catch(e) {}
        delete window[callbackName]
        reject(new Error(`JSONP request failed for URL: ${scriptUrl}`))
      }
      
      // Add script to head to trigger request
      console.log('📤 Appending script tag to trigger JSONP request...')
      document.head.appendChild(script)
      
      // Timeout after 30 seconds
      setTimeout(() => {
        if (window[callbackName]) {
          try { document.head.removeChild(script) } catch(e) {}
          delete window[callbackName]
          reject(new Error('JSONP request timeout'))
        }
      }, 30000)
    })
  }

  /**
   * Fallback: Make a regular fetch request
   */
  async makeFetchRequest(params = {}) {
    if (this.isDemo) {
      console.log('📋 Demo mode: Simulating fetch request')
      return { success: true, message: 'Demo mode response' }
    }

    try {
      const urlParams = new URLSearchParams(params)
      const response = await fetch(`${this.webAppUrl}?${urlParams.toString()}`, {
        method: 'GET',
        mode: 'cors'
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Fetch request failed:', error)
      throw error
    }
  }

  async initialize() {
    if (this.isDemo) {
      console.log('📊 Google Sheets Service initialized in DEMO mode')
      console.log('⚠️  Set VITE_GOOGLE_APPS_SCRIPT_URL in .env for real Google Sheets integration')
      return true
    }

    try {
      console.log('🔗 Testing Google Apps Script connection...')
      
      // First try JSONP (guaranteed to work)
      const data = await this.makeJSONPRequest({ action: 'test' })
      console.log('📊 Google Sheets Service initialized successfully (JSONP)')
      console.log('Response:', data)
      return true
      
    } catch (jsonpError) {
      console.warn('JSONP failed, trying regular fetch:', jsonpError.message)
      
      try {
        // Fallback to regular fetch
        const data = await this.makeFetchRequest({ action: 'test' })
        console.log('📊 Google Sheets Service initialized successfully (Fetch)')
        console.log('Response:', data)
        return true
        
      } catch (fetchError) {
        console.error('❌ Both JSONP and Fetch failed')
        console.error('JSONP Error:', jsonpError.message)
        console.error('Fetch Error:', fetchError.message)
        return false
      }
    }
  }

  async createBookingSheet() {
    if (this.isDemo) {
      console.log('📋 Booking sheet initialized (demo mode)')
      return true
    }

    try {
      console.log('📋 Initializing booking sheet...')
      
      // Try JSONP first
      const result = await this.makeJSONPRequest({ action: 'initSheet' })
      console.log('📋 Booking sheet initialized successfully (JSONP):', result)
      return true
      
    } catch (jsonpError) {
      console.warn('JSONP failed for initSheet, trying fetch:', jsonpError.message)
      
      try {
        // Fallback to fetch
        const result = await this.makeFetchRequest({ action: 'initSheet' })
        console.log('📋 Booking sheet initialized successfully (Fetch):', result)
        return true
        
      } catch (fetchError) {
        console.error('❌ Failed to initialize sheet with both methods')
        console.error('JSONP Error:', jsonpError.message)
        console.error('Fetch Error:', fetchError.message)
        return false
      }
    }
  }

  async saveBooking(bookingData) {
    // Generate a unique booking ID
    const bookingId = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase()
    
    const completeBookingData = {
      ...bookingData,
      bookingId,
      timestamp: new Date().toLocaleString('en-GB'),
      status: 'Confirmed'
    }

    if (this.isDemo) {
      // Demo mode - just log the data
      console.log('📊 DEMO: Booking would be saved to Google Sheets:')
      console.table(completeBookingData)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { 
        success: true, 
        bookingId,
        message: 'Demo mode - check console for booking data'
      }
    }

    try {
      console.log('💾 Saving booking to Google Sheets...')
      
      // Prepare booking data for URL parameters
      const params = {
        action: 'saveBooking',
        timestamp: completeBookingData.timestamp,
        bookingId: completeBookingData.bookingId,
        serviceType: completeBookingData.serviceType,
        persons: completeBookingData.persons.toString(),
        price: completeBookingData.price,
        firstName: completeBookingData.firstName,
        lastName: completeBookingData.lastName,
        email: completeBookingData.email,
        phone: completeBookingData.phone,
        lender: completeBookingData.lender,
        solicitor: completeBookingData.solicitor,
        appointmentDate: completeBookingData.appointmentDate,
        appointmentTime: completeBookingData.appointmentTime,
        status: completeBookingData.status
      }

      // Try JSONP first
      const result = await this.makeJSONPRequest(params)
      console.log('✅ Booking saved to Google Sheets successfully (JSONP):', bookingId)
      console.log('Server response:', result)
      
      return { 
        success: true, 
        bookingId,
        message: 'Booking saved successfully to Google Sheets',
        ...result
      }

    } catch (jsonpError) {
      console.warn('JSONP failed for saveBooking, trying fetch:', jsonpError.message)
      
      try {
        // Fallback to fetch
        const params = {
          action: 'saveBooking',
          timestamp: completeBookingData.timestamp,
          bookingId: completeBookingData.bookingId,
          serviceType: completeBookingData.serviceType,
          persons: completeBookingData.persons.toString(),
          price: completeBookingData.price,
          firstName: completeBookingData.firstName,
          lastName: completeBookingData.lastName,
          email: completeBookingData.email,
          phone: completeBookingData.phone,
          lender: completeBookingData.lender,
          solicitor: completeBookingData.solicitor,
          appointmentDate: completeBookingData.appointmentDate,
          appointmentTime: completeBookingData.appointmentTime,
          status: completeBookingData.status
        }
        
        const result = await this.makeFetchRequest(params)
        console.log('✅ Booking saved to Google Sheets successfully (Fetch):', bookingId)
        console.log('Server response:', result)
        
        return { 
          success: true, 
          bookingId,
          message: 'Booking saved successfully to Google Sheets',
          ...result
        }
        
      } catch (fetchError) {
        console.error('❌ Failed to save booking with both methods')
        console.error('JSONP Error:', jsonpError.message)
        console.error('Fetch Error:', fetchError.message)
        return { success: false, error: `Both JSONP (${jsonpError.message}) and Fetch (${fetchError.message}) failed` }
      }
    }
  }

  async getBookings() {
    if (this.isDemo) {
      // Return sample data in demo mode
      return [
        {
          booking_id: 'BK-DEMO-001',
          timestamp: new Date().toLocaleString('en-GB'),
          service_type: 'Bridging Finance',
          package: '1 Person',
          price: '150.00',
          first_name: 'Demo',
          last_name: 'User',
          email: 'demo@example.com',
          phone: '+44 1234 567890',
          status: 'Confirmed'
        }
      ]
    }

    try {
      console.log('📊 Fetching bookings from Google Sheets...')
      
      // Try JSONP first
      const result = await this.makeJSONPRequest({ action: 'getBookings' })
      console.log('📊 Bookings fetched successfully (JSONP)')
      return result
      
    } catch (jsonpError) {
      console.warn('JSONP failed for getBookings, trying fetch:', jsonpError.message)
      
      try {
        // Fallback to fetch
        const result = await this.makeFetchRequest({ action: 'getBookings' })
        console.log('📊 Bookings fetched successfully (Fetch)')
        return result
        
      } catch (fetchError) {
        console.error('❌ Failed to fetch bookings with both methods')
        console.error('JSONP Error:', jsonpError.message)
        console.error('Fetch Error:', fetchError.message)
        return []
      }
    }
  }
}

export default new GoogleSheetsService();