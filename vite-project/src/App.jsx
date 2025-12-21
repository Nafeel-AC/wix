import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import './App.css'

function BookingFlow({ preSelectedService = null, servicesFilter = null }) {
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

  const allServices = [
    {
      id: 'immigration',
      title: 'Immigration',
      description: 'Leading Immigration Solicitors Delivering Expert Support with Visas, Citizenship, and Residency Matters.'
    },
    {
      id: 'family-solicitors',
      title: 'Family Solicitors',
      description: 'Your Complete Family Law Solution: Divorce, Child Arrangements, Prenups, and Mediation - All Under One Roof.'
    },
    {
      id: 'buy-to-let',
      title: 'Buy-to-Let',
      description: 'Before You Sign as a Guarantor for a Company Buy-to-Let - Get Independent Legal Advice You Can Trust.'
    },
    {
      id: 'bridging-finance',
      title: 'Bridging Finance',
      description: 'Bridging Finance on the horizon? Let us provide the Independent Legal Advice you need to stay protected, informed, and confident in your next financial move.'
    },
    {
      id: 'joint-borrower',
      title: 'Joint Borrower Sole Proprietor',
      description: 'Taking part in a Joint Borrower, Sole Proprietor arrangement? Our Independent Legal Advice gives you clarity, confidence, and complete protection before you commit.'
    },
    {
      id: 'second-charge',
      title: '2nd Charge Loan',
      description: 'Adding a Second Charge to Your Mortgage? Book your Independent Legal Advice today.'
    },
    {
      id: 'occupier-consent',
      title: 'Occupier Consent Form',
      description: 'Understand that the lender\'s charge will rank above your rights in the property. Book Independent Legal Advice to ensure full clarity before signing.'
    },
    {
      id: 'business-loan',
      title: 'Business Loan',
      description: 'Business finance ahead? Get trusted Independent Legal Advice before committing to loan terms or guarantees.'
    },
    {
      id: 'third-party-borrowing',
      title: '3rd Party Borrowing',
      description: 'Borrowing in another person\'s or company\'s name, supported by a personal guarantee or property charge.'
    },
    {
      id: 'equity-release',
      title: 'Equity Release',
      description: 'Equity Release can affect inheritance, property rights, and future financial planning. Book Independent Legal Advice to gain clarity and confidence before proceeding.'
    },
    {
      id: 'change-ownership',
      title: 'Change of Ownership',
      description: 'Changing legal ownership by adding or removing a co-owner.'
    },
    {
      id: 'deposit-gift',
      title: 'Deposit Gift',
      description: 'Deposit gifts can carry important legal and financial implications. Book Independent Legal Advice to safeguard your position before accepting or providing a gift.'
    },
    {
      id: 'personal-injury',
      title: 'Personal Injury',
      description: 'Expert legal advice and representation for personal injury claims, accidents, and compensation matters.'
    }
  ]

  // Filter services based on servicesFilter function if provided
  const services = servicesFilter ? allServices.filter(servicesFilter) : allServices
 
  const defaultPackageOptions = [
    {
      id: '1-person',
      persons: 1,
      price: 150.00,
      savings: null
    },
    {
      id: '2-persons',
      persons: 2,
      price: 300.00,
      savings: null
    },
    {
      id: '3-persons',
      persons: 3,
      price: 450.00,
      savings: null
    },
    {
      id: '4-persons',
      persons: 4,
      price: 600.00,
      savings: null
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

  const getPackageOptions = () => {
    if (selectedService === 'immigration' || selectedService === 'personal-injury') {
      return [
        {
          id: '30-min',
          label: '30 Mins',
          durationLabel: '30min',
          price: 60.00
        },
        {
          id: '60-min',
          label: '1 Hour',
          durationLabel: '1 hour',
          price: 120.00
        }
      ]
    }

    if (selectedService === 'family-solicitors') {
      return [
        {
          id: 'family-30-min',
          label: '30 Mins',
          durationLabel: '30min',
          price: 180.00
        },
        {
          id: 'family-60-min',
          label: '1 Hour',
          durationLabel: '1 hour',
          price: 300.00
        }
      ]
    }

    if (selectedService === 'buy-to-let') {
      return [
        {
          id: 'buy-to-let-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'bridging-finance') {
      return [
        {
          id: 'bridging-finance-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'joint-borrower') {
      return [
        {
          id: 'joint-borrower-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'second-charge') {
      return [
        {
          id: 'second-charge-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'occupier-consent') {
      return [
        {
          id: 'occupier-consent-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'business-loan') {
      return [
        {
          id: 'business-loan-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'third-party-borrowing') {
      return [
        {
          id: 'third-party-borrowing-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'equity-release') {
      return [
        {
          id: 'equity-release-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'change-ownership') {
      return [
        {
          id: 'change-ownership-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    if (selectedService === 'deposit-gift') {
      return [
        {
          id: 'deposit-gift-2-persons',
          persons: 2,
          price: 270.00,
          savings: null
        }
      ]
    }

    // Fallback to default person-based packages for all other services
    return defaultPackageOptions
  }

  const getSelectedServiceTitle = () => {
    return services.find(s => s.id === selectedService)?.title || ''
  }

  const getSelectedPackage = () => {
    return getPackageOptions().find(p => p.id === selectedPackage)
  }

  const getServiceDetails = () => {
    const service = services.find(s => s.id === selectedService)
    const package_ = getSelectedPackage()
    
    if (!service || !package_) return null

    const baseDetails = {
      'immigration': {
        fullTitle: `Immigration Legal Services - ${package_.label}`,
        description: 'Get one-on-one advice from our specialist immigration solicitors, either via Zoom or in person. We\'ll review your case, explain your options, and guide you through applications or appeals. Expert guidance on visas, citizenship, and residency.',
        costDescription: '£60 for 30 Mins (VAT included). £120 for 1 Hour (VAT included).',
        serviceDescription: '',
        meetingPoints: [
          'Review your immigration case and documentation',
          'Provide expert legal advice on visa and residency options',
          'Assist with application preparation and submission',
          'Address any questions or concerns about your immigration status'
        ]
      },
      'personal-injury': {
        fullTitle: `Personal Injury Legal Services - ${package_.label}`,
        description: 'Get one-on-one advice from our specialist personal injury solicitors, either via Zoom or in person. We\'ll review your case, explain your options, and guide you through your claim and compensation matters.',
        costDescription: '£60 for 30 Mins (VAT included). £120 for 1 Hour (VAT included).',
        serviceDescription: '',
        meetingPoints: [
          'Review your personal injury case and documentation',
          'Provide expert legal advice on your claim and compensation options',
          'Assist with claim preparation and submission',
          'Address any questions or concerns about your personal injury case'
        ]
      },
      'family-solicitors': {
        fullTitle: `Family Law Services - ${package_.label}`,
        description: 'Discuss your family law matters with our experienced solicitors, including divorce, child custody, and family agreements.',
        costDescription: 'Cost: £180.00 for 30 mins or £300.00 for 1 hour (including VAT). Optional Special Delivery: £18.00 (including VAT), if required.',
        serviceDescription: 'Our family law team provides comprehensive services, including divorce proceedings, child custody arrangements, prenuptial agreements, family mediation, and other family-related legal matters. Book your consultation today to get professional guidance and support tailored to your situation.',
        meetingPoints: [
          'Review your family law case and circumstances',
          'Provide expert legal advice on your options',
          'Assist with documentation and legal proceedings',
          'Answer any questions or concerns about your family law matter'
        ]
      },
      'buy-to-let': {
        fullTitle: 'Independent Legal Advice (ILA) for Buy-to-Let',
        description: 'Make sure your buy-to-let mortgage proceeds without delays by booking a session for Independent Legal Advice (ILA) to meet your lender’s requirements.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT), if needed.',
        serviceDescription: 'This service is required when a personal guarantee is being provided or property is being used as security for a buy-to-let mortgage. Buy-to-let mortgages are commonly used by property investors to acquire rental properties.',
        meetingPoints: [
          'Review all security documents you are required to sign',
          'Explain your legal responsibilities and the implications of signing',
          'Answer any questions or concerns you may have',
          'Sign and issue the necessary ILA Solicitor Certificate to ensure full compliance with your lender’s requirements'
        ]
      },
      'bridging-finance': {
        fullTitle: `Independent Legal Advice (ILA) for ${package_.persons} Person${package_.persons > 1 ? 's' : ''} for Bridging Finance`,
        description: 'Ensure your bridging finance proceeds smoothly by booking a session for Independent Legal Advice (ILA) to satisfy your lender’s requirements.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT), if needed.',
        serviceDescription: 'This ILA service is required when a personal guarantee is provided or property is used as security for a bridging loan. Bridging finance is often used by property investors or individuals to quickly secure short-term funding for purchasing or refinancing a property. Book your session today to complete your bridging finance process safely, confidently, and in full compliance with your lender’s requirements.',
        meetingPoints: [
          'Review the loan and security documents you need to sign',
          'Explain your legal responsibilities and the implications of signing',
          'Answer any questions or concerns regarding the bridging loan',
          'Sign and provide the required ILA Solicitor Certificate to ensure compliance with the lender’s conditions'
        ]
      },
      'joint-borrower': {
        fullTitle: 'Independent Legal Advice (ILA) for Joint Borrower Sole Proprietor',
        description: 'Ensure your Joint Borrower Sole Proprietor (JBSP) mortgage proceeds smoothly by booking a session for Independent Legal Advice (ILA) to meet your lender’s requirements.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT), if required.',
        serviceDescription: 'This ILA service is required when one party is taking on a mortgage as a Joint Borrower Sole Proprietor, meaning one person holds the mortgage while others provide personal guarantees. This structure is commonly used by property investors and individuals buying rental or investment properties. Book your consultation today to complete your JBSP mortgage safely, confidently, and in compliance with lender requirements.',
        meetingPoints: [
          'Review all mortgage and security documents you are required to sign',
          'Explain your legal responsibilities and the implications of signing',
          'Answer any questions or concerns you may have',
          'Sign and provide the required ILA Solicitor Certificate to ensure full compliance with your lender’s requirements'
        ]
      },
      'second-charge': {
        fullTitle: 'Independent Legal Advice (ILA) for 2nd Charge Loan',
        description: 'Ensure your second charge loan proceeds without delays by booking a session for Independent Legal Advice (ILA) to satisfy your lender’s requirements.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Second charge loans are often used by property owners to access additional borrowing against an existing mortgage. This service is essential when property is used as security or a personal guarantee is required. Book your session today to proceed confidently with your second charge loan.',
        meetingPoints: [
          'Review your loan and security documents',
          'Explain your legal responsibilities and the implications of signing',
          'Answer any questions or concerns',
          'Sign and provide the required ILA Solicitor Certificate for lender compliance'
        ]
      },
      'occupier-consent': {
        fullTitle: 'Occupier Consent Form — Independent Legal Advice',
        description: 'If you’ve been asked to sign an Occupier Consent Form, book Independent Legal Advice (ILA) to fully understand your rights and obligations.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Occupier Consent Forms confirm that a lender’s charge takes priority over any rights you may hold in a property. This service ensures you understand the legal implications before signing. Book your consultation today to protect your interests and complete the process safely.',
        meetingPoints: [
          'Review the occupier consent documents',
          'Explain your legal responsibilities and the effect on your property rights',
          'Answer any questions or concerns',
          'Sign and issue the ILA Solicitor Certificate to meet lender requirements'
        ]
      },
      'business-loan': {
        fullTitle: 'Business Loan — Independent Legal Advice',
        description: 'Secure your business loan safely by booking Independent Legal Advice (ILA) to meet your lender’s requirements.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'This service is required when a personal guarantee is provided or property is used as security for a business loan. It applies to both property investors and individuals arranging commercial or personal business loans. Book your session today to proceed with your business loan confidently.',
        meetingPoints: [
          'Review loan and security documents',
          'Explain your legal responsibilities and obligations',
          'Address questions or concerns',
          'Sign and provide the required ILA Solicitor Certificate for lender compliance'
        ]
      },
      'third-party-borrowing': {
        fullTitle: 'Third Party Borrowing — Independent Legal Advice',
        description: 'If a third party is helping you secure a mortgage, book Independent Legal Advice (ILA) to ensure all parties understand their rights and responsibilities.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Third-party borrowing occurs when someone other than the borrower provides a personal guarantee or property as security. Our service ensures all parties fully understand their obligations and legal implications. Book your consultation today to safeguard all parties in the borrowing arrangement.',
        meetingPoints: [
          'Review mortgage and security documents',
          'Explain the implications of providing or receiving support',
          'Answer any questions or concerns',
          'Issue the ILA Solicitor Certificate for lender compliance'
        ]
      },
      'equity-release': {
        fullTitle: 'Equity Release — Independent Legal Advice',
        description: 'Planning to release equity from your property? Book Independent Legal Advice (ILA) to understand the full legal and financial implications.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Equity release allows homeowners to access funds from their property, often for retirement or other financial needs. This service ensures you fully understand the long-term impact on your estate and obligations. Book your consultation today to proceed safely and confidently with equity release.',
        meetingPoints: [
          'Review the equity release documents',
          'Explain your rights, responsibilities, and potential risks',
          'Answer any questions or concerns',
          'Sign and provide the required ILA Solicitor Certificate to meet lender requirements'
        ]
      },
      'change-ownership': {
        fullTitle: 'Change of Ownership — Independent Legal Advice',
        description: 'Transferring property ownership? Book Independent Legal Advice (ILA) to ensure the process is legally compliant and your interests are protected.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Change of ownership may involve transferring a mortgage or providing security. Our service ensures all parties understand their obligations and any lender requirements. Book your consultation today to complete the ownership transfer with confidence.',
        meetingPoints: [
          'Review transfer and security documents',
          'Explain your responsibilities and legal implications',
          'Answer any questions or concerns',
          'Sign and provide the ILA Solicitor Certificate for lender compliance'
        ]
      },
      'deposit-gift': {
        fullTitle: 'Deposit Gift — Independent Legal Advice',
        description: 'Receiving or giving a deposit gift? Book Independent Legal Advice (ILA) to understand the legal implications and protect your mortgage process.',
        costDescription: 'Cost: £270.00 for 2 persons (including VAT). Optional Special Delivery: £18.00 (including VAT).',
        serviceDescription: 'Deposit gifts often involve family members or friends providing funds for a property purchase. Our service ensures all parties understand the financial and legal responsibilities before proceeding. Book your consultation today to safeguard your mortgage process and ensure full legal clarity.',
        meetingPoints: [
          'Review deposit gift documents',
          'Explain the legal implications and responsibilities for donors and recipients',
          'Answer any questions or concerns',
          'Sign and issue the ILA Solicitor Certificate for lender compliance'
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
              <h2>
                {selectedService === 'immigration' || selectedService === 'family-solicitors' || selectedService === 'personal-injury'
                  ? 'Select Appointment Length:'
                  : `Select Number of Persons - ${getPackageOptions().length} Option${getPackageOptions().length > 1 ? 's' : ''}:`}
              </h2>
              
              <div
                className={`packages-grid ${
                  getPackageOptions().length === 1 ? 'single-option' : ''
                }`}
              >
                {getPackageOptions().map((package_) => (
                  <div 
                    key={package_.id}
                    className={`package-card ${selectedPackage === package_.id ? 'selected' : ''}`}
                    onClick={() => handlePackageSelect(package_.id)}
                  >
                    <div className="package-header">
                      <h3>
                        {selectedService === 'immigration' || selectedService === 'family-solicitors' || selectedService === 'personal-injury'
                          ? `${getSelectedServiceTitle()} - ${package_.label}`
                          : `${getSelectedServiceTitle()} - ${package_.persons} Person${package_.persons > 1 ? 's' : ''}`}
                      </h3>
                      <div className="price-info">
                        <span className="price">£{package_.price.toFixed(2)}</span>
                        <span className="vat-text">Incl. VAT</span>
                      </div>
                    </div>

                    <div className="package-details">
                      <span className="detail-item">📋 {getSelectedServiceTitle()}</span>
                      <span className="detail-item">
                        ⏰ {(selectedService === 'immigration' || selectedService === 'family-solicitors' || selectedService === 'personal-injury') && package_.durationLabel
                          ? package_.durationLabel
                          : '15min'}
                      </span>
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
                <h1>
                  {(selectedService === 'immigration' || selectedService === 'family-solicitors' || selectedService === 'personal-injury') && getSelectedPackage()
                    ? `${getSelectedServiceTitle()} - ${getSelectedPackage().label}`
                    : `${getSelectedServiceTitle()} - ${getSelectedPackage()?.persons} Person${getSelectedPackage()?.persons > 1 ? 's' : ''}`}
                </h1>
                <div className="service-info-icons">
                  <span className="info-item">📋 {getSelectedServiceTitle()}</span>
                  <span className="info-item">
                    ⏰ {(selectedService === 'immigration' || selectedService === 'family-solicitors' || selectedService === 'personal-injury') && getSelectedPackage()?.durationLabel
                      ? getSelectedPackage().durationLabel
                      : '15min slots'}
                  </span>
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
                      {getServiceDetails().serviceDescription && (
                        <p className="service-explanation">
                          {getServiceDetails().serviceDescription}
                        </p>
                      )}
                      
                      <div className="meeting-section">
                      <h3>
                        {selectedService === 'family-solicitors'
                          ? 'What to expect during your consultation (Zoom or in-person):'
                          : 'During the Zoom meeting, the solicitor will:'}
                      </h3>
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
  // Filter function to exclude immigration and family-solicitors for ILA page
  const ilaServicesFilter = (service) => {
    return service.id !== 'immigration' && service.id !== 'family-solicitors'
  }

  return (
    <Routes>
      <Route path="/" element={<BookingFlow />} />
      <Route path="/immigration" element={<BookingFlow preSelectedService="immigration" />} />
      <Route path="/family-solicitors" element={<BookingFlow preSelectedService="family-solicitors" />} />
      <Route path="/personal-injury" element={<BookingFlow preSelectedService="personal-injury" />} />
      <Route path="/independent-legal-advice" element={<BookingFlow servicesFilter={ilaServicesFilter} />} />
    </Routes>
  )
}

export default App
