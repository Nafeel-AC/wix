import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import './App.css'

function BookingFlow({ preSelectedService = null }) {
  const isDirectLink = preSelectedService !== null
  
  const [selectedService, setSelectedService] = useState(preSelectedService || '')
  const [selectedPackage, setSelectedPackage] = useState('')
  const [currentStep, setCurrentStep] = useState(isDirectLink ? 'package-selection' : 'service-selection')
  const [activeTab, setActiveTab] = useState('details')
  const [cameFromDirectLink, setCameFromDirectLink] = useState(isDirectLink)
  
  // Booking modal states
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingStep, setBookingStep] = useState('appointments') // appointments, information, confirmation
  
  // Appointment selection states
  const [selectedSolicitor, setSelectedSolicitor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  
  // Contact information states
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    lender: ''
  })

  const services = [
    {
      id: 'immigration',
      title: 'Immigration',
      description: 'Expert legal advice and representation for all immigration matters including visas, citizenship, and residency applications.'
    },
    {
      id: 'family-solicitors',
      title: 'Family Solicitors',
      description: 'Comprehensive family law services including divorce, child custody, prenuptial agreements, and family mediation.'
    },
    {
      id: 'buy-to-let',
      title: 'Buy-to-Let',
      description: 'Acting as guarantor for a limited company\'s buy-to-let mortgage.'
    },
    {
      id: 'bridging-finance',
      title: 'Bridging Finance',
      description: 'Need to provide a personal guarantee or legal charge over property for a short-term loan?'
    },
    {
      id: 'joint-borrower',
      title: 'Joint Borrower Sole Proprietor',
      description: 'Joining a mortgage to help with affordability but without taking legal ownership.'
    },
    {
      id: 'second-charge',
      title: '2nd Charge Loan',
      description: 'Securing a loan with a second charge alongside your existing mortgage.'
    },
    {
      id: 'occupier-consent',
      title: 'Occupier Consent Form',
      description: 'Confirming the lender\'s charge takes priority over any rights you may have in the property.'
    },
    {
      id: 'business-loan',
      title: 'Business Loan',
      description: 'Providing a personal guarantee or using property as security for a business borrowing.'
    },
    {
      id: 'third-party-borrowing',
      title: '3rd Party Borrowing',
      description: 'Borrowing in another person\'s or company\'s name, supported by a personal guarantee or property charge.'
    },
    {
      id: 'equity-release',
      title: 'Equity Release',
      description: 'Releasing funds from your home through a lifetime mortgage or similar arrangement.'
    },
    {
      id: 'change-ownership',
      title: 'Change of Ownership',
      description: 'Changing legal ownership by adding or removing a co-owner.'
    },
    {
      id: 'deposit-gift',
      title: 'Deposit Gift',
      description: 'Gifting funds towards a property purchase with no repayment expected.'
    }
  ]

  const packageOptions = [
    {
      id: '1-person',
      persons: 1,
      price: 150.00,
      savings: null
    },
    {
      id: '2-persons',
      persons: 2,
      price: 270.00,
      savings: '10%'
    },
    {
      id: '3-persons',
      persons: 3,
      price: 382.50,
      savings: '15%'
    },
    {
      id: '4-persons',
      persons: 4,
      price: 480.00,
      savings: '20%'
    }
  ]

  const solicitors = [
    {
      id: 'dennis-brewer',
      name: 'Dennis Brewer',
      description: 'A partner at Brewer Wallace Solicitors, Dennis Brewer is dedicated...',
      avatar: '👨‍💼',
      timeSlots: [
        '9:30 - 9:45', '9:45 - 10:00', '10:00 - 10:15', '10:15 - 10:30',
        '10:30 - 10:45', '10:45 - 11:00', '11:00 - 11:15', '11:15 - 11:30',
        '11:30 - 11:45', '11:45 - 12:00', '12:00 - 12:15', '12:15 - 12:30',
        '12:30 - 12:45', '12:45 - 13:00', '13:30 - 13:45', '13:45 - 14:00',
        '14:00 - 14:15', '14:15 - 14:30', '14:30 - 14:45', '14:45 - 15:00',
        '15:00 - 15:15', '15:15 - 15:30'
      ]
    },
    {
      id: 'kevin-ogle',
      name: 'Kevin Ogle',
      description: 'Kevin is a highly experienced SRA Regulated freelance solicitor and...',
      avatar: '👨‍⚖️',
      timeSlots: [
        '9:00 - 9:15', '9:15 - 9:30', '9:30 - 9:45', '9:45 - 10:00',
        '10:30 - 10:45', '10:45 - 11:00', '11:30 - 11:45', '11:45 - 12:00',
        '13:00 - 13:15', '13:15 - 13:30', '13:30 - 13:45', '13:45 - 14:00',
        '14:30 - 14:45', '14:45 - 15:00', '15:30 - 15:45', '15:45 - 16:00'
      ]
    }
  ]

  const lenders = [
    'Barclays Bank', 'HSBC', 'Lloyds Bank', 'NatWest', 'Santander',
    'Halifax', 'TSB', 'Metro Bank', 'Monzo', 'Starling Bank', 'Other'
  ]

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId)
    // Automatically proceed to package selection when a service is selected
    setCurrentStep('package-selection')
  }

  const handleContinue = () => {
    if (selectedService) {
      setCurrentStep('package-selection')
    }
  }

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId)
  }


  const handleGoBack = () => {
    if (currentStep === 'package-selection') {
      // Only go back to service-selection if we didn't come from a direct link
      if (!cameFromDirectLink) {
        setCurrentStep('service-selection')
      }
      setSelectedPackage('')
    } else if (currentStep === 'service-details') {
      setCurrentStep('package-selection')
    } else if (currentStep === 'booking-details') {
      setCurrentStep('service-details')
    }
  }

  const handleBookNow = () => {
    setShowBookingModal(true)
    setBookingStep('appointments')
  }

  const closeBookingModal = () => {
    setShowBookingModal(false)
    setBookingStep('appointments')
    // Reset booking states
    setSelectedSolicitor('')
    setSelectedDate('')
    setSelectedTime('')
    setContactInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      lender: ''
    })
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime('') // Reset time when date changes
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleSolicitorSelect = (solicitor) => {
    setSelectedSolicitor(solicitor)
    setSelectedTime('') // Reset time when solicitor changes
  }

  const proceedToInformation = () => {
    if (selectedSolicitor && selectedDate && selectedTime) {
      setBookingStep('information')
    }
  }

  const proceedToConfirmation = () => {
    const isContactComplete = contactInfo.firstName && contactInfo.lastName && 
                             contactInfo.email && contactInfo.phone && contactInfo.lender
    if (isContactComplete) {
      setBookingStep('confirmation')
    }
  }

  const sendConfirmationEmail = async () => {
    console.log('🚀 sendConfirmationEmail function called!')
    console.log('Selected service:', selectedService)
    console.log('Contact info:', contactInfo)
    
    try {
      const service = services.find(s => s.id === selectedService)
      const package_ = getSelectedPackage()
      const solicitor = solicitors.find(s => s.id === selectedSolicitor)
      
      console.log('Service found:', service)
      console.log('Package found:', package_)
      console.log('Solicitor found:', solicitor)

      // Send confirmation email (skip if EmailJS not configured)
      try {
        const templateParams = {
          to_name: `${contactInfo.firstName} ${contactInfo.lastName}`,
          to_email: contactInfo.email,
          service_name: service?.title,
          package_details: `${package_?.persons} Person${package_?.persons > 1 ? 's' : ''}`,
          price: `£${package_?.price.toFixed(2)}`,
          solicitor_name: solicitor?.name,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          phone: contactInfo.phone,
          lender: contactInfo.lender
        }

        // Only send email if EmailJS is configured
        const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
        if (emailServiceId && emailServiceId !== 'your_service_id') {
          await emailjs.send(
            emailServiceId,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
          console.log('✅ Email sent successfully')
          alert('✅ Booking confirmed! Confirmation email sent.')
        } else {
          console.log('⚠️ EmailJS not configured, skipping email')
          alert('✅ Booking confirmed! (Email service not configured)')
        }
      } catch (emailError) {
        console.warn('⚠️ Email sending failed (non-critical):', emailError)
        alert('✅ Booking confirmed! (Email sending failed - please contact support)')
      }
      
      console.log('✅ sendConfirmationEmail completed successfully')
    } catch (error) {
      console.error('❌ sendConfirmationEmail failed with error:', error)
      console.error('Error stack:', error.stack)
      alert('⚠️ An error occurred. Please try again or contact support.')
    }
  }

  const finishBooking = () => {
    closeBookingModal()
    // You could redirect to a thank you page or show a success message
  }

  const getSelectedServiceTitle = () => {
    return services.find(s => s.id === selectedService)?.title || ''
  }

  const getSelectedPackage = () => {
    return packageOptions.find(p => p.id === selectedPackage)
  }

  const getServiceDetails = () => {
    const service = services.find(s => s.id === selectedService)
    const package_ = getSelectedPackage()
    
    if (!service || !package_) return null

    const baseDetails = {
      'immigration': {
        fullTitle: `Immigration Legal Services for ${package_.persons} Person${package_.persons > 1 ? 's' : ''}`,
        description: 'Book a consultation with our expert immigration solicitors to discuss your visa, citizenship, or residency needs.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'Our immigration solicitors provide expert legal advice and representation for all immigration matters including visa applications, citizenship applications, residency permits, and immigration appeals.',
        meetingPoints: [
          'Review your immigration case and documentation',
          'Provide expert legal advice on visa and residency options',
          'Assist with application preparation and submission',
          'Address any questions or concerns about your immigration status'
        ]
      },
      'family-solicitors': {
        fullTitle: `Family Law Services for ${package_.persons} Person${package_.persons > 1 ? 's' : ''}`,
        description: 'Book a consultation with our experienced family solicitors to discuss your family law matters including divorce, custody, and family agreements.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'Our family solicitors provide comprehensive family law services including divorce proceedings, child custody arrangements, prenuptial agreements, family mediation, and other family-related legal matters.',
        meetingPoints: [
          'Review your family law case and circumstances',
          'Provide expert legal advice on your options',
          'Assist with documentation and legal proceedings',
          'Address any questions or concerns about your family law matter'
        ]
      },
      'buy-to-let': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Buy-to-Let`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your buy-to-let mortgage process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when someone is providing a personal guarantee and/or property as security for a buy-to-let mortgage. Buy-to-let mortgages are commonly used by property investors to purchase rental properties.',
        meetingPoints: [
          'Review the security documents you need to sign',
          'Explain the legal implications and responsibilities associated with signing',
          'Address any questions or concerns you may have',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'bridging-finance': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Bridging Finance`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your bridging finance process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when someone is providing a personal guarantee and/or property as security for a bridging loan. Bridging finance is often used for short-term borrowing needs, such as property purchases or refurbishments, where the lender will require security for the loan.',
        meetingPoints: [
          'Review the security documents you need to sign',
          'Explain the legal implications and responsibilities associated with signing',
          'Address any questions or concerns you may have',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'joint-borrower': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Joint Borrower Sole Proprietor`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your joint borrower sole proprietor mortgage process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when someone is joining a mortgage to help with affordability but without taking legal ownership. This arrangement allows family members to help with mortgage payments while the property remains solely owned by the main borrower.',
        meetingPoints: [
          'Review the mortgage documents and your obligations as a joint borrower',
          'Explain the legal implications and financial responsibilities',
          'Address any questions or concerns you may have',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'second-charge': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for 2nd Charge Loan`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your second charge loan process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when securing a loan with a second charge alongside your existing mortgage. Second charge loans allow you to borrow against the equity in your property while keeping your existing mortgage in place.',
        meetingPoints: [
          'Review the second charge documents and security arrangements',
          'Explain the legal implications and risks of second charge lending',
          'Address any questions or concerns you may have',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'occupier-consent': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Occupier Consent Form`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your occupier consent process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when confirming the lender\'s charge takes priority over any rights you may have in the property. This is typically needed when you live in a property that is being used as security for someone else\'s borrowing.',
        meetingPoints: [
          'Review the occupier consent documents you need to sign',
          'Explain your rights and the priority of the lender\'s charge over the property',
          'Address any questions or concerns you may have about your occupancy rights',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'business-loan': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Business Loan`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your business loan process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when providing a personal guarantee or using property as security for a business borrowing. This ensures you understand the personal liability you are taking on for business debts.',
        meetingPoints: [
          'Review the business loan documents and personal guarantee requirements',
          'Explain the legal implications and personal liability for business debts',
          'Address any questions or concerns about the business loan arrangement',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'third-party-borrowing': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for 3rd Party Borrowing`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your third party borrowing process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when borrowing in another person\'s or company\'s name, supported by a personal guarantee or property charge. This ensures you understand your obligations when supporting someone else\'s borrowing.',
        meetingPoints: [
          'Review the third party borrowing documents and your guarantee obligations',
          'Explain the legal implications of supporting another party\'s borrowing',
          'Address any questions about your liability and the security arrangements',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'equity-release': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Equity Release`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your equity release process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when releasing funds from your home through a lifetime mortgage or similar arrangement. This ensures you understand the long-term implications of equity release on your property and inheritance.',
        meetingPoints: [
          'Review the equity release documents and loan terms',
          'Explain the long-term implications on your property and inheritance',
          'Address any questions about repayment terms and interest accumulation',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      },
      'change-ownership': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Change of Ownership`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your change of ownership process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when changing legal ownership by adding or removing a co-owner. This ensures you understand the legal and financial implications of ownership changes on your property.',
        meetingPoints: [
          'Review the ownership change documents and new ownership structure',
          'Explain the legal implications of adding or removing co-owners',
          'Address any questions about property rights and financial responsibilities',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the requirements'
        ]
      },
      'deposit-gift': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Deposit Gift`,
        description: 'Book a session for ILA to satisfy your lender\'s requirements and ensure your deposit gift process proceeds without delay.',
        costDescription: `The cost for ${package_.persons === 1 ? 'one person' : `${package_.persons} persons`} is £${package_.price.toFixed(2)} including VAT, with an additional £18 (including VAT) for Special Delivery postage if needed.`,
        serviceDescription: 'This ILA service is required when gifting funds towards a property purchase with no repayment expected. This confirms the gift is genuine and there are no hidden obligations or expectations of repayment.',
        meetingPoints: [
          'Review the gift documentation and confirm no repayment is expected',
          'Explain the legal implications of property gifting and tax considerations',
          'Address any questions about the gift arrangements and future obligations',
          'Sign and provide the necessary ILA Solicitor Certificate, ensuring compliance with the lender\'s requirements'
        ]
      }
    }

    return baseDetails[selectedService] || null
  }

  // Calendar utility functions
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
      const prevMonthDays = getDaysInMonth(prevMonth, prevYear)
      const day = prevMonthDays - firstDay + i + 1
      days.push({ day, isCurrentMonth: false, isPrevMonth: true })
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${day}. ${months[currentMonth]} ${currentYear}`
      const isToday = new Date().toDateString() === new Date(currentYear, currentMonth, day).toDateString()
      const isPast = new Date(currentYear, currentMonth, day) < new Date().setHours(0,0,0,0)
      
      days.push({ 
        day, 
        isCurrentMonth: true, 
        isPrevMonth: false,
        dateString,
        isToday,
        isPast,
        isSelectable: !isPast
      })
    }

    // Add days from next month to fill the grid
    const remainingCells = 42 - days.length // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      days.push({ day, isCurrentMonth: false, isPrevMonth: false })
    }

    return days
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    }
  }

  return (
    <div className="app-container">
      <div className="form-container">
        {/* Service Selection Step */}
        {currentStep === 'service-selection' && (
          <>
            <div className="header">
              <h1>Book Your Appointment</h1>
              <div className="header-info">
                <h2>Fixed Cost - No Hidden Fees</h2>
                <p>No payment until after your appointment. Fully cancellable at any time.</p>
              </div>
            </div>

            <div className="service-selection">
              <h3>Please select the service you require:</h3>
              
              <div className="services-grid">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h4>{service.title}</h4>
                    <p>{service.description}</p>
                    <div className="service-button">
                      {selectedService === service.id ? 'Selected' : 'Select'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Package Selection Step */}
        {currentStep === 'package-selection' && (
          <>
            {!cameFromDirectLink && (
              <div className="go-back-container">
                <button className="go-back-button" onClick={handleGoBack}>
                  ‹ Go Back
                </button>
              </div>
            )}

            <div className="package-selection">
              <h2>Select Number of Persons - 4 Options:</h2>
              
              <div className="packages-grid">
                {packageOptions.map((package_) => (
                  <div 
                    key={package_.id}
                    className={`package-card ${selectedPackage === package_.id ? 'selected' : ''}`}
                    onClick={() => handlePackageSelect(package_.id)}
                  >
                    <div className="package-header">
                      <h3>{getSelectedServiceTitle()} - {package_.persons} Person{package_.persons > 1 ? 's' : ''}</h3>
                      <div className="price-info">
                        <span className="price">£{package_.price.toFixed(2)}</span>
                        <span className="vat-text">Incl. VAT</span>
                      </div>
                    </div>

                    <div className="package-details">
                      <span className="detail-item">📋 {getSelectedServiceTitle()}</span>
                      <span className="detail-item">⏰ 15min</span>
                      <span className="detail-item">💻 Zoom Meeting</span>
                    </div>

                    <button 
                      className="package-continue-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPackage(package_.id)
                        setCurrentStep('service-details')
                      }}
                    >
                      Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Service Details Step */}
        {currentStep === 'service-details' && (
          <>
            <div className="go-back-container">
              <button className="go-back-button" onClick={handleGoBack}>
                ‹ Go Back
              </button>
            </div>

            <div className="service-details-header">
              <div className="service-title-section">
                <h1>{getSelectedServiceTitle()} - {getSelectedPackage()?.persons} Person{getSelectedPackage()?.persons > 1 ? 's' : ''}</h1>
                <div className="service-info-icons">
                  <span className="info-item">📋 {getSelectedServiceTitle()}</span>
                  <span className="info-item">⏰ 15min slots</span>
                  <span className="info-item">💻 Zoom Meeting</span>
                </div>
              </div>
              <div className="pricing-section">
                <div className="price-display">
                  <span className="price-amount">£{getSelectedPackage()?.price.toFixed(2)}</span>
                  <span className="price-vat">Incl. VAT</span>
                </div>
                <button className="book-now-button" onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
      </div>

            <div className="service-tabs">
              <button 
                className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button 
                className={`tab-button ${activeTab === 'solicitors' ? 'active' : ''}`}
                onClick={() => setActiveTab('solicitors')}
              >
                Solicitors
        </button>
            </div>

            <div className="service-content">
              {activeTab === 'details' && (
                <div className="details-content">
                  {getServiceDetails() && (
                    <>
                      <h2>{getServiceDetails().fullTitle}</h2>
                      
                      <p className="service-description">
                        {getServiceDetails().description}
                      </p>
                      
                      <p className="cost-description">
                        {getServiceDetails().costDescription}
                      </p>
                      
                      <p className="service-explanation">
                        {getServiceDetails().serviceDescription}
                      </p>
                      
                      <div className="meeting-section">
                        <h3>During the Zoom meeting, the solicitor will:</h3>
                        <ul className="meeting-points">
                          {getServiceDetails().meetingPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'solicitors' && (
                <div className="solicitors-content">
                  <h2>Our Qualified Solicitors</h2>
                  <p>Information about our solicitors will be displayed here...</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Booking Details Step - Placeholder */}
        {currentStep === 'booking-details' && (
          <div className="booking-details">
            <div className="go-back-container">
              <button className="go-back-button" onClick={handleGoBack}>
                ‹ Go Back
              </button>
            </div>
            <h2>Booking Details</h2>
            <p>This step will be implemented next...</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Appointments Step */}
            {bookingStep === 'appointments' && (
              <>
                <div className="modal-header">
                  <button className="modal-back-btn" onClick={closeBookingModal}>‹</button>
                  <h2>Appointments</h2>
                  <button className="modal-close-btn" onClick={closeBookingModal}>×</button>
                </div>
                
                <div className="modal-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '33%'}}></div>
                  </div>
                </div>

                <div className="appointment-content">
                  <p>Number of appointments required for booking: 1.</p>
                  
                  <div className="solicitor-selection">
                    <label>* Select a solicitor (you can change this to see more appointment times):</label>
                    <select 
                      value={selectedSolicitor} 
                      onChange={(e) => handleSolicitorSelect(e.target.value)}
                      className="solicitor-dropdown"
                    >
                      <option value="">Select Solicitor...</option>
                      {solicitors.map(solicitor => (
                        <option key={solicitor.id} value={solicitor.id}>
                          {solicitor.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedSolicitor && (
                    <div className="solicitor-info">
                      {solicitors.filter(s => s.id === selectedSolicitor).map(solicitor => (
                        <div key={solicitor.id} className="solicitor-card">
                          <div className="solicitor-avatar">{solicitor.avatar}</div>
                          <div className="solicitor-details">
                            <h4>{solicitor.name}</h4>
                            <p>{solicitor.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="appointments-section">
                    <h3>Appointments:</h3>
                    
                    <div className="date-time-selection">
                      <div className="selection-header">
                        <span>1. Date and Time</span>
                        <button className="select-btn">Select ▲</button>
                      </div>
                      
                      <div className="calendar-navigation">
                        <select 
                          value={currentMonth} 
                          onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                        >
                          {months.map((month, index) => (
                            <option key={index} value={index}>{month}</option>
                          ))}
                        </select>
                        <select 
                          value={currentYear} 
                          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                        >
                          <option value={2024}>2024</option>
                          <option value={2025}>2025</option>
                        </select>
                        <button onClick={() => navigateMonth('prev')}>‹</button>
                        <button onClick={() => navigateMonth('next')}>›</button>
                      </div>

                      <div className="calendar-grid">
                        <div className="calendar-header">
                          <div>Mon</div>
                          <div>Tue</div>
                          <div>Wed</div>
                          <div>Thu</div>
                          <div>Fri</div>
                          <div>Sat</div>
                          <div>Sun</div>
                        </div>
                        <div className="calendar-body">
                          {generateCalendarDays().map((dayObj, index) => (
                            <button
                              key={index}
                              className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} 
                                         ${dayObj.isPast ? 'past-day' : ''} 
                                         ${selectedDate === dayObj.dateString ? 'selected' : ''}
                                         ${dayObj.isToday ? 'today' : ''}`}
                              onClick={() => dayObj.isSelectable ? handleDateSelect(dayObj.dateString) : null}
                              disabled={dayObj.isPast || !dayObj.isCurrentMonth}
                            >
                              {dayObj.day}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {selectedDate && selectedSolicitor && (
                      <div className="time-slots-section">
                        <h4>{selectedDate} - 9:30</h4>
                        <div className="time-slots-grid">
                          {solicitors.find(s => s.id === selectedSolicitor)?.timeSlots.map((slot, index) => (
                            <button
                              key={index}
                              className={`time-slot ${selectedTime === slot ? 'selected' : ''}`}
                              onClick={() => handleTimeSelect(slot)}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button 
                    className="continue-btn"
                    onClick={proceedToInformation}
                    disabled={!selectedSolicitor || !selectedDate || !selectedTime}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* Information Step */}
            {bookingStep === 'information' && (
              <>
                <div className="modal-header">
                  <button className="modal-back-btn" onClick={() => setBookingStep('appointments')}>‹</button>
                  <h2>Your Information</h2>
                  <button className="modal-close-btn" onClick={closeBookingModal}>×</button>
                </div>
                
                <div className="modal-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '66%'}}></div>
                  </div>
                </div>

                <div className="information-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label>*First Name:</label>
                      <input
                        type="text"
                        placeholder="Enter first name"
                        value={contactInfo.firstName}
                        onChange={(e) => setContactInfo({...contactInfo, firstName: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>*Last Name:</label>
                      <input
                        type="text"
                        placeholder="Enter last name"
                        value={contactInfo.lastName}
                        onChange={(e) => setContactInfo({...contactInfo, lastName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>*Email:</label>
                      <input
                        type="email"
                        placeholder="Enter email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>*Phone:</label>
                      <div className="phone-input">
                        <select className="country-code">
                          <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Enter phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>*Select Lender</label>
                    <select
                      value={contactInfo.lender}
                      onChange={(e) => setContactInfo({...contactInfo, lender: e.target.value})}
                    >
                      <option value="">Select</option>
                      {lenders.map(lender => (
                        <option key={lender} value={lender}>{lender}</option>
                      ))}
                    </select>
                  </div>

                  <div className="agreement-section">
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      *I understand that if the solicitor needs to send signed documentation by post, 
                      an additional £15 plus VAT (£18) fee for Special Delivery will apply.
                    </label>
                    
                    <label className="checkbox-label">
                      <input type="checkbox" required />
                      *I confirm that I have read and agree to ILA-Connect's Website Terms of Use, 
                      Booking Terms and Privacy Policy
                    </label>
                  </div>

                  <button 
                    className="continue-btn"
                    onClick={proceedToConfirmation}
                  >
                    Continue
                  </button>
                </div>
              </>
            )}

            {/* Confirmation Step */}
            {bookingStep === 'confirmation' && (
              <>
                <div className="modal-header">
                  <button className="modal-back-btn" onClick={() => setBookingStep('information')}>‹</button>
                  <h2>Booking Confirmed!</h2>
                  <button className="modal-close-btn" onClick={closeBookingModal}>×</button>
                </div>

                <div className="confirmation-content">
                  <div className="confirmation-icon">🎉</div>
                  <h2>Booking Confirmed!</h2>
                  <p>Add to Calendar</p>

                  <div className="calendar-options">
                    <button className="calendar-btn">
                      <img src="https://www.google.com/favicon.ico" alt="Google" />
                      Google
                    </button>
                    <button className="calendar-btn">
                      <img src="https://outlook.com/favicon.ico" alt="Outlook" />
                      Outlook
                    </button>
                    <button className="calendar-btn">
                      <img src="https://www.yahoo.com/favicon.ico" alt="Yahoo" />
                      Yahoo
                    </button>
                    <button className="calendar-btn">
                      <img src="https://www.apple.com/favicon.ico" alt="Apple" />
                      Apple
                    </button>
                  </div>

                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>Service</span>
                      <span>{getSelectedServiceTitle()} - {getSelectedPackage()?.persons} Person{getSelectedPackage()?.persons > 1 ? 's' : ''}</span>
                    </div>
                    <div className="summary-row">
                      <span>Price:</span>
                      <span>£{getSelectedPackage()?.price.toFixed(2)} - by invoice</span>
                    </div>
                    <div className="summary-row">
                      <span>Your Name:</span>
                      <span>{contactInfo.firstName} {contactInfo.lastName}</span>
                    </div>
                    <div className="summary-row">
                      <span>Email Address:</span>
                      <span>{contactInfo.email}</span>
                    </div>
                    <div className="summary-row">
                      <span>Phone Number:</span>
                      <span>{contactInfo.phone}</span>
                    </div>
                  </div>

                  <button 
                    className="finish-btn"
                    onClick={async () => {
                      console.log('🔘 Finish button clicked!')
                      try {
                        await sendConfirmationEmail()
                        console.log('✅ Booking process completed, closing modal...')
                        finishBooking()
                      } catch (error) {
                        console.error('❌ Error in finish button handler:', error)
                        // Still close the modal even if there's an error
                        finishBooking()
                      }
                    }}
                  >
                    Finish
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingFlow />} />
      <Route path="/immigration" element={<BookingFlow preSelectedService="immigration" />} />
      <Route path="/family-solicitors" element={<BookingFlow preSelectedService="family-solicitors" />} />
    </Routes>
  )
}

export default App
