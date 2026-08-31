'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const CITIES = ['All Cities', 'Hyderabad', 'Chennai', 'Bangalore', 'Mumbai'];

export const CENTRES = [
  { id: 'hitec-city', name: 'Hitec City', city: 'Hyderabad', floors: 4, rooms: 32, seats: 450, occupancy: 88 },
  { id: 'banjara-hills', name: 'Banjara Hills', city: 'Hyderabad', floors: 3, rooms: 24, seats: 320, occupancy: 82 },
  { id: 'western-aqua', name: 'Western Aqua', city: 'Hyderabad', floors: 5, rooms: 40, seats: 520, occupancy: 91 },
  { id: 'gachibowli', name: 'Gachibowli', city: 'Hyderabad', floors: 3, rooms: 20, seats: 280, occupancy: 78 },
  { id: 'guindy', name: 'Guindy Cybervale', city: 'Chennai', floors: 4, rooms: 36, seats: 480, occupancy: 85 },
  { id: 't-nagar', name: 'T Nagar Commercial', city: 'Chennai', floors: 3, rooms: 22, seats: 300, occupancy: 90 },
  { id: 'alwarpet', name: 'Alwarpet Towers', city: 'Chennai', floors: 3, rooms: 18, seats: 240, occupancy: 79 },
  { id: 'nungambakkam', name: 'Nungambakkam High', city: 'Chennai', floors: 4, rooms: 30, seats: 410, occupancy: 83 },
  { id: 'millers-road', name: 'Millers Road', city: 'Bangalore', floors: 5, rooms: 45, seats: 600, occupancy: 94 },
  { id: 'residency-road', name: 'Residency Road', city: 'Bangalore', floors: 4, rooms: 35, seats: 460, occupancy: 89 },
  { id: 'bkc', name: 'BKC One', city: 'Mumbai', floors: 6, rooms: 50, seats: 680, occupancy: 96 }
];

export const ROLES = {
  super_admin: {
    id: 'super_admin',
    name: 'Vikram Malhotra',
    roleLabel: 'Super Admin — Enterprise CEO',
    email: 'vikram.m@workafella.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    scope: 'All Branches (Enterprise)'
  },
  branch_admin: {
    id: 'branch_admin',
    name: 'Sarah Jenkins',
    roleLabel: 'Branch Admin — Hitec City',
    email: 'sarah.j@workafella.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City, Hyderabad'
  },
  finance_user: {
    id: 'finance_user',
    name: 'Rohan Mehta',
    roleLabel: 'Finance Controller',
    email: 'rohan.m@workafella.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    scope: 'Enterprise Finance'
  },
  operations_facility: {
    id: 'operations_facility',
    name: 'Karthik Raja',
    roleLabel: 'Operations & Facility Manager',
    email: 'karthik.r@workafella.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City, Hyderabad'
  },
  client_admin: {
    id: 'client_admin',
    name: 'Ananya Sharma',
    roleLabel: 'Client Admin — Acme Innovations',
    email: 'ananya@acmeinnovations.io',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    scope: 'Acme Innovations (Room 704 & 705)'
  },
  security_guard: {
    id: 'security_guard',
    name: 'Ramesh Kumar',
    roleLabel: 'Front Desk Security Officer',
    email: 'security.hitec@workafella.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City Gate Kiosk'
  }
};

export const AppProvider = ({ children }) => {
  // Navigation & Authentication state
  const [currentUser, setCurrentUser] = useState(ROLES.branch_admin);
  const [activeBranch, setActiveBranch] = useState(CENTRES[0]);
  const [activeCity, setActiveCity] = useState('All Cities');
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Active Hold Modal State (5-minute countdown)
  const [activeHold, setActiveHold] = useState(null);
  const [holdSecondsRemaining, setHoldSecondsRemaining] = useState(300);

  // Global Mock Domain States
  const [clients, setClients] = useState([
    {
      id: 'CL-101',
      name: 'Acme Innovations Pvt Ltd',
      legalEntity: 'Acme Global Technologies India LLP',
      pan: 'AABCA1234F',
      gstin: '36AABCA1234F1Z5',
      parentGroup: 'Acme Holdings Corp',
      centre: 'Hitec City',
      rooms: ['704', '705'],
      seats: 45,
      ratePerSeat: 14500,
      contractStart: '2026-01-01',
      contractEnd: '2026-12-31',
      status: 'Active',
      freeHoursEntitlement: 45,
      freeHoursUsed: 18,
      riskScore: 24,
      churnRisk: 'Low'
    },
    {
      id: 'CL-102',
      name: 'Zenith Systems & AI',
      legalEntity: 'Zenith AI Solutions India Pvt Ltd',
      pan: 'BBBCZ9876K',
      gstin: '36BBBCZ9876K1Z9',
      parentGroup: 'Zenith Group',
      centre: 'Hitec City',
      rooms: ['708'],
      seats: 20,
      ratePerSeat: 15000,
      contractStart: '2025-06-01',
      contractEnd: '2026-09-30',
      status: 'Expiring Soon',
      freeHoursEntitlement: 20,
      freeHoursUsed: 19,
      riskScore: 78,
      churnRisk: 'High'
    },
    {
      id: 'CL-103',
      name: 'Quantum BioLabs',
      legalEntity: 'Quantum Therapeutics Ltd',
      pan: 'CCCDQ4567M',
      gstin: '36CCCDQ4567M1Z2',
      parentGroup: 'Quantum Healthcare',
      centre: 'Hitec City',
      rooms: ['601', '602', '603'],
      seats: 60,
      ratePerSeat: 14000,
      contractStart: '2026-03-01',
      contractEnd: '2027-02-28',
      status: 'Active',
      freeHoursEntitlement: 60,
      freeHoursUsed: 22,
      riskScore: 15,
      churnRisk: 'Low'
    },
    {
      id: 'CL-104',
      name: 'FinEdge Capital Partners',
      legalEntity: 'FinEdge Advisory Services LLP',
      pan: 'DEDEF8899L',
      gstin: '36DEDEF8899L1Z8',
      parentGroup: 'FinEdge Global',
      centre: 'Millers Road',
      rooms: ['402'],
      seats: 30,
      ratePerSeat: 16500,
      contractStart: '2025-11-01',
      contractEnd: '2026-10-31',
      status: 'Active',
      freeHoursEntitlement: 30,
      freeHoursUsed: 26,
      riskScore: 62,
      churnRisk: 'Medium'
    }
  ]);

  const [meetingRooms, setMeetingRooms] = useState([
    {
      id: 'MR-01',
      name: 'The Boardroom 7A',
      centre: 'Hitec City',
      floor: '7th Floor',
      capacity: 16,
      hourlyRate: 2500,
      amenities: ['4K Video Conf', 'Wireless Presentation', 'Dual Whiteboard', 'Polycom Audio', 'Espresso Bar'],
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'MR-02',
      name: 'Think Tank Suite',
      centre: 'Hitec City',
      floor: '6th Floor',
      capacity: 8,
      hourlyRate: 1400,
      amenities: ['4K Display', 'Whiteboard Wall', 'Acoustic Paneling', 'Conference Cam'],
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'MR-03',
      name: 'Creator Pod Alpha',
      centre: 'Hitec City',
      floor: '7th Floor',
      capacity: 4,
      hourlyRate: 850,
      amenities: ['Video Podcast Gear', 'Ring Light', 'USB-C Dock', 'Soundproof Glass'],
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'MR-04',
      name: 'Horizon Conference Hall',
      centre: 'Hitec City',
      floor: '8th Floor Penthouse',
      capacity: 32,
      hourlyRate: 5000,
      amenities: ['Motorized Dual Screens', 'Stage Audio', 'Live Stream System', 'Lounge Foyer'],
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      isAvailable: true
    },
    {
      id: 'MR-05',
      name: 'Nexus Strategy Lab',
      centre: 'Hitec City',
      floor: '5th Floor',
      capacity: 12,
      hourlyRate: 1800,
      amenities: ['Smart Interactive Display', 'Digital Whiteboard', 'Executive Chairs'],
      image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=80',
      isAvailable: true
    }
  ]);

  const [bookings, setBookings] = useState([
    {
      id: 'BK-9901',
      room: 'The Boardroom 7A',
      location: 'Floor 7, Executive Wing',
      client: 'Acme Innovations Pvt Ltd',
      host: 'Ananya Sharma',
      date: '2026-08-30',
      timeSlot: '10:00 AM - 12:00 PM',
      durationHours: 2,
      attendees: 12,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Crestron 4K Dual Displays', 'Dolby Soundbar', 'Barista Espresso & Tea Service'],
      notes: 'Quarterly board review and engineering strategy sync.'
    },
    {
      id: 'BK-9902',
      room: 'Think Tank Suite',
      location: 'Floor 6, Innovation Hub',
      client: 'Zenith Systems & AI',
      host: 'Rahul Varma',
      date: '2026-08-30',
      timeSlot: '02:00 PM - 04:00 PM',
      durationHours: 2,
      attendees: 6,
      isEntitlementUsed: false,
      entitlementHours: 0,
      billableAmount: 2800,
      status: 'Confirmed',
      type: 'external',
      amenities: ['4K Display', 'Whiteboard Wall', 'Acoustic Paneling'],
      notes: 'Client partner demo for automated logistics pipeline.'
    },
    {
      id: 'BK-9903',
      room: 'Creator Pod Alpha',
      location: 'Floor 7, Media Lab',
      client: 'Quantum BioLabs',
      host: 'Dr. Srinivas Rao',
      date: '2026-08-31',
      timeSlot: '11:00 AM - 01:00 PM',
      durationHours: 2,
      attendees: 3,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Video Podcast Gear', 'Ring Light', 'Soundproof Glass'],
      notes: 'Scientific webinar podcast recording episode 4.'
    },
    {
      id: 'BK-9904',
      room: 'The Boardroom 7A',
      location: 'Floor 7, Executive Wing',
      client: 'NovaTech Solutions Pvt Ltd',
      host: 'Priya Sharma',
      date: '2026-09-04',
      timeSlot: '10:00 AM - 12:00 PM',
      durationHours: 2,
      attendees: 10,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Crestron 4K Dual Displays', 'Barista Espresso & Tea Service'],
      notes: 'NovaTech monthly sprint planning & client sync.'
    },
    {
      id: 'BK-9905',
      room: 'Horizon Conference Hall',
      location: 'Floor 8, Penthouse Hall',
      client: 'Acme Innovations Pvt Ltd',
      host: 'Vikram Malhotra',
      date: '2026-09-10',
      timeSlot: '02:00 PM - 05:00 PM',
      durationHours: 3,
      attendees: 28,
      isEntitlementUsed: false,
      entitlementHours: 0,
      billableAmount: 15000,
      status: 'Confirmed',
      type: 'external',
      amenities: ['Motorized Dual Screens', 'Stage Audio', 'Live Stream System'],
      notes: 'All-Hands Townhall & product roadmap reveal.'
    },
    {
      id: 'BK-9906',
      room: 'Nexus Strategy Lab',
      location: 'Floor 5, Strategy Zone',
      client: 'FinEdge Capital',
      host: 'Siddharth Roy',
      date: '2026-09-15',
      timeSlot: '03:00 PM - 05:00 PM',
      durationHours: 2,
      attendees: 8,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Smart Interactive Display', 'Digital Whiteboard'],
      notes: 'Series B term sheet review with lead investors.'
    },
    {
      id: 'BK-9907',
      room: 'The Boardroom 7A',
      location: 'Floor 7, Executive Wing',
      client: 'Zenith Systems & AI',
      host: 'Tanmay Saxena',
      date: '2026-09-22',
      timeSlot: '11:00 AM - 01:00 PM',
      durationHours: 2,
      attendees: 12,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Crestron 4K Dual Displays', 'Dolby Soundbar'],
      notes: 'Quarterly steering committee meeting.'
    },
    {
      id: 'BK-9908',
      room: 'Creator Pod Alpha',
      location: 'Floor 7, Media Lab',
      client: 'NovaTech Solutions Pvt Ltd',
      host: 'Neha Kapoor',
      date: '2026-10-05',
      timeSlot: '09:00 AM - 11:00 AM',
      durationHours: 2,
      attendees: 4,
      isEntitlementUsed: true,
      entitlementHours: 2,
      billableAmount: 0,
      status: 'Confirmed',
      type: 'internal',
      amenities: ['Video Podcast Gear', 'Ring Light', 'USB-C Dock'],
      notes: 'Q4 Product marketing video shoot.'
    }
  ]);

  const [tickets, setTickets] = useState([
    {
      id: 'TICK-8021',
      client: 'Acme Innovations Pvt Ltd',
      title: 'Dedicated Leased Line Secondary Gateway Latency',
      category: 'Internet / Wi-Fi',
      priority: 'Urgent',
      status: 'In Progress',
      assignee: 'Naveen Kumar (Network Lead)',
      createdAt: '2026-08-29 14:30',
      slaDue: '2026-08-29 18:30',
      slaStatus: 'Warning',
      description: 'Ping latency exceeding 140ms on secondary VLAN trunk in Room 705. Affecting transatlantic team sync.',
      comments: [
        { author: 'Ananya Sharma', time: '14:30', text: 'Submitted ticket with speedtest logs attached.' },
        { author: 'Naveen Kumar', time: '14:45', text: 'Triaged. Initiating failover check on edge router switch 3.' }
      ]
    },
    {
      id: 'TICK-8022',
      client: 'Zenith Systems & AI',
      title: 'HVAC Temperature Adjustment — Zone 7B',
      category: 'Maintenance',
      priority: 'Medium',
      status: 'Assigned',
      assignee: 'Suresh Babu (HVAC)',
      createdAt: '2026-08-29 11:15',
      slaDue: '2026-08-29 16:00',
      slaStatus: 'Normal',
      description: 'Room temperature reading 19C; requested adjustment to standard 23C comfort range.',
      comments: []
    },
    {
      id: 'TICK-8023',
      client: 'Quantum BioLabs',
      title: 'Pantry Nespresso Pod Restock & Filter Swap',
      category: 'Pantry',
      priority: 'Low',
      status: 'Resolved',
      assignee: 'Deepak M (Housekeeping)',
      createdAt: '2026-08-28 09:00',
      slaDue: '2026-08-28 13:00',
      slaStatus: 'Complied',
      description: 'Floor 6 pantry machine stock depleted.',
      comments: [{ author: 'Deepak M', time: '10:20', text: 'Restocked 100 Dark Roast capsules and changed AquaFilter cartridge.' }]
    }
  ]);

  const [visitors, setVisitors] = useState([
    {
      id: 'VIS-4401',
      name: 'Ravi Teja Varma',
      phone: '+91 98765 43210',
      email: 'ravi.teja@sequoia.com',
      company: 'Sequoia Capital India',
      host: 'Ananya Sharma (Acme Innovations)',
      date: '2026-08-30',
      timeSlot: '11:00 AM - 01:00 PM',
      purpose: 'Investor Q3 Portfolio Review',
      qrCode: 'WF-QR-889021',
      status: 'Expected',
      checkInTime: null,
      checkOutTime: null,
      isWatchlisted: false
    },
    {
      id: 'VIS-4402',
      name: 'Priya Nair',
      phone: '+91 98111 22334',
      email: 'priya.nair@deloitte.com',
      company: 'Deloitte Consulting',
      host: 'Vikram Malhotra',
      date: '2026-08-29',
      timeSlot: '02:30 PM - 05:00 PM',
      purpose: 'Statutory Annual Audit',
      qrCode: 'WF-QR-771234',
      status: 'Checked In',
      checkInTime: '02:28 PM',
      checkOutTime: null,
      isWatchlisted: false
    },
    {
      id: 'VIS-4403',
      name: 'David Miller',
      phone: '+91 97788 99001',
      email: 'david.m@cisco.com',
      company: 'Cisco Systems',
      host: 'Naveen Kumar',
      date: '2026-08-29',
      timeSlot: '10:00 AM - 12:30 PM',
      purpose: 'Core Switch Maintenance Visit',
      qrCode: 'WF-QR-663920',
      status: 'Checked Out',
      checkInTime: '09:55 AM',
      checkOutTime: '12:40 PM',
      isWatchlisted: false
    }
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-08-01',
      client: 'Acme Innovations Pvt Ltd',
      centre: 'Hitec City',
      period: 'August 2026',
      amount: 769950,
      taxAmount: 117450,
      grandTotal: 769950,
      seatsAmount: 652500,
      overageAmount: 0,
      status: 'Approved',
      dueDate: '2026-09-05',
      generatedDate: '2026-08-28',
      lineItems: [
        { desc: 'Private Office Suite 704 & 705 (45 Seats @ ₹14,500/seat)', qty: 45, rate: 14500, total: 652500 },
        { desc: 'Conference Room Usage (18 hrs consumed within 45 hrs free entitlement)', qty: 18, rate: 0, total: 0 },
        { desc: 'High-speed Dedicated IP Bandwidth Allocation (100 Mbps)', qty: 1, rate: 0, total: 0 }
      ]
    },
    {
      id: 'INV-2026-08-02',
      client: 'Zenith Systems & AI',
      centre: 'Hitec City',
      period: 'August 2026',
      amount: 365800,
      taxAmount: 55800,
      grandTotal: 365800,
      seatsAmount: 300000,
      overageAmount: 10000,
      status: 'Finance Review',
      dueDate: '2026-09-05',
      generatedDate: '2026-08-28',
      lineItems: [
        { desc: 'Dedicated Team Wing 708 (20 Seats @ ₹15,000/seat)', qty: 20, rate: 15000, total: 300000 },
        { desc: 'Conference Room Overage (4 hrs beyond 20 hrs entitlement @ ₹2,500/hr)', qty: 4, rate: 2500, total: 10000 }
      ]
    },
    {
      id: 'INV-2026-08-03',
      client: 'Quantum BioLabs',
      centre: 'Hitec City',
      period: 'August 2026',
      amount: 991200,
      taxAmount: 151200,
      grandTotal: 991200,
      seatsAmount: 840000,
      overageAmount: 0,
      status: 'Sent',
      dueDate: '2026-09-05',
      generatedDate: '2026-08-27',
      lineItems: [
        { desc: 'Custom Built Lab Workspace (60 Seats @ ₹14,000/seat)', qty: 60, rate: 14000, total: 840000 }
      ]
    }
  ]);

  const [expenses, setExpenses] = useState([
    {
      id: 'EXP-901',
      centre: 'Hitec City',
      category: 'Facility',
      subcategory: 'Electricity & DG Fuel Backup',
      amount: 385000,
      date: '2026-08-25',
      submittedBy: 'Karthik Raja (Ops)',
      status: 'Finance Review',
      receiptUrl: 'electricity_bill_aug.pdf',
      isRecurring: true,
      description: 'TSSPDCL Monthly Commercial HT Grid Power + 400L Diesel Genset top-up.'
    },
    {
      id: 'EXP-902',
      centre: 'Hitec City',
      category: 'Vendor',
      subcategory: 'Facility Management & Housekeeping Agency',
      amount: 210000,
      date: '2026-08-26',
      submittedBy: 'Karthik Raja (Ops)',
      status: 'Approved',
      receiptUrl: 'sis_security_invoice.pdf',
      isRecurring: true,
      vendor: 'SIS Security & Facility Services LLP',
      description: 'Monthly housekeeping & 24/7 security guard deployment (14 staff).'
    },
    {
      id: 'EXP-903',
      centre: 'Hitec City',
      category: 'Asset-Related',
      subcategory: 'Daikin VRV Chiller Compressor Overhaul',
      amount: 85000,
      date: '2026-08-28',
      submittedBy: 'Suresh Babu (HVAC)',
      status: 'Branch Admin Review',
      receiptUrl: 'daikin_amc_receipt.pdf',
      isRecurring: false,
      assetTag: 'WF-AC-701',
      description: 'Replacement of solenoid valve and refrigerant R410A recharge.'
    },
    {
      id: 'EXP-904',
      centre: 'Hitec City',
      category: 'Office / Operational',
      subcategory: 'Pantry & Coffee Bean Consumables',
      amount: 42000,
      date: '2026-08-27',
      submittedBy: 'Deepak M (Ops)',
      status: 'Approved',
      receiptUrl: 'blue_tokai_invoice.pdf',
      isRecurring: true,
      description: '100kg Arabica Roast beans, tea selections, organic sweeteners.'
    }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    {
      id: 'ACC-3101',
      employeeName: 'Kavita Sundaram',
      email: 'kavita.s@acmeinnovations.io',
      company: 'Acme Innovations Pvt Ltd',
      centre: 'Hitec City',
      floorRoom: 'Floor 7 / Suite 704',
      scope: ['24/7 Building Turnstile', 'Suite 704 Smart Lock', '7th Floor Meeting Rooms'],
      status: 'Under Review',
      submittedDate: '2026-08-29',
      idDocument: 'kavita_aadhaar_masked.pdf',
      biometricStatus: 'Pending Verification'
    },
    {
      id: 'ACC-3102',
      employeeName: 'Tanmay Saxena',
      email: 'tanmay@zenithai.com',
      company: 'Zenith Systems & AI',
      centre: 'Hitec City',
      floorRoom: 'Floor 7 / Wing 708',
      scope: ['24/7 Building Turnstile', 'Wing 708 Smart Lock'],
      status: 'Enrollment Pending',
      submittedDate: '2026-08-28',
      idDocument: 'tanmay_passport_scan.pdf',
      biometricStatus: 'Ready for Physical Capture'
    },
    {
      id: 'ACC-3103',
      employeeName: 'Dr. Meera Nambiar',
      email: 'meera.n@quantumbio.com',
      company: 'Quantum BioLabs',
      centre: 'Hitec City',
      floorRoom: 'Floor 6 / Lab 601',
      scope: ['24/7 Building Turnstile', 'Lab 601 Bio-Lock', 'Level 6 Penthouse Lounge'],
      status: 'Active',
      submittedDate: '2026-08-20',
      idDocument: 'meera_aadhaar_verified.pdf',
      biometricStatus: 'Enrolled & Synced'
    }
  ]);

  const [inventoryItems, setInventoryItems] = useState([
    { id: 'INV-01', item: 'Arabica Coffee Beans (Dark Roast)', category: 'Pantry', unit: 'Kg', stock: 45, threshold: 20, isLow: false, lastRestocked: '2026-08-27', vendor: 'Blue Tokai Coffee', unitCost: 1200 },
    { id: 'INV-02', item: 'Organic Green Tea Envelopes', category: 'Pantry', unit: 'Boxes', stock: 12, threshold: 15, isLow: true, lastRestocked: '2026-08-15', vendor: 'Twinings India', unitCost: 450 },
    { id: 'INV-03', item: 'A4 Executive Printing Paper (75 GSM)', category: 'Office Supplies', unit: 'Reams', stock: 80, threshold: 25, isLow: false, lastRestocked: '2026-08-20', vendor: 'JK Paper Ltd', unitCost: 320 },
    { id: 'INV-04', item: 'Daikin AC Hepa Filter Replacements', category: 'Maintenance', unit: 'Units', stock: 4, threshold: 6, isLow: true, lastRestocked: '2026-07-28', vendor: 'Daikin India', unitCost: 3500 },
    { id: 'INV-05', item: 'Organic Microfiber Cleaning Cloths', category: 'Housekeeping', unit: 'Packs', stock: 35, threshold: 10, isLow: false, lastRestocked: '2026-08-22', vendor: 'SIS Facility Services', unitCost: 280 },
    { id: 'INV-06', item: 'Automatic Hand Sanitizer Gel Refills', category: 'Housekeeping', unit: 'Liters', stock: 50, threshold: 15, isLow: false, lastRestocked: '2026-08-24', vendor: 'Diversey Pro', unitCost: 650 }
  ]);

  const [assets, setAssets] = useState([
    {
      id: 'WF-AC-701',
      name: 'Daikin VRV Chiller Unit #3 (20HP)',
      category: 'HVAC & Climate',
      location: 'Roof Plant / Floor 7 Zone',
      assignedTo: 'Central Facility Operations',
      condition: 'Good',
      purchaseValue: 650000,
      currentValue: 480000,
      warrantyExpiry: '2028-12-31',
      amcVendor: 'Daikin India HVAC Services',
      amcDueDays: 120,
      purchaseDate: '2024-01-15',
      timeline: [
        { date: '2026-08-28', event: 'Solenoid valve replacement & refrigerant top-up', cost: '₹14,500' },
        { date: '2026-06-15', event: 'Quarterly preventative filter cleaning & current load check', cost: '₹4,000' }
      ]
    },
    {
      id: 'WF-NET-402',
      name: 'Cisco Catalyst 9300 48-Port Core Switch',
      category: 'IT & Networking',
      location: 'Floor 7 Server Room Rack 2',
      assignedTo: 'Naveen Kumar (Network Lead)',
      condition: 'Good',
      purchaseValue: 420000,
      currentValue: 340000,
      warrantyExpiry: '2029-05-30',
      amcVendor: 'Cisco SmartNet Premium',
      amcDueDays: 340,
      purchaseDate: '2024-03-20',
      timeline: [
        { date: '2026-08-29', event: 'Fiber transceiver swap on secondary SFP+ uplink port', cost: '₹8,500' },
        { date: '2026-01-10', event: 'IOS-XE firmware security patch update to v17.9.4', cost: '₹0' }
      ]
    },
    {
      id: 'WF-GEN-101',
      name: 'Cummins 500 kVA Silent DG Generator',
      category: 'Power & Utilities',
      location: 'Basement 2 Generator Bay',
      assignedTo: 'Suresh Babu (Facility Lead)',
      condition: 'Good',
      purchaseValue: 1850000,
      currentValue: 1420000,
      warrantyExpiry: '2027-08-15',
      amcVendor: 'Cummins Power Care India',
      amcDueDays: 45,
      purchaseDate: '2023-08-10',
      timeline: [
        { date: '2026-08-25', event: '400L Diesel replenishment & battery electrolyte top-up', cost: '₹36,000' }
      ]
    },
    {
      id: 'WF-AV-880',
      name: 'Polycom RealPresence 4K Dual Conference Display',
      category: 'Audio / Visual',
      location: 'The Boardroom 7A',
      assignedTo: 'Operations Desk',
      condition: 'Good',
      purchaseValue: 380000,
      currentValue: 290000,
      warrantyExpiry: '2027-02-28',
      amcVendor: 'Crestron India Pro Services',
      amcDueDays: 180,
      purchaseDate: '2025-02-14',
      timeline: [
        { date: '2026-07-20', event: 'Microphone array acoustic calibration & software update', cost: '₹2,500' }
      ]
    }
  ]);

  const [vendors, setVendors] = useState([
    {
      id: 'VEND-01',
      name: 'SIS Security & Facility Services LLP',
      category: 'Security & Housekeeping',
      contractEnd: '2026-09-15',
      isRenewingSoon: true,
      rating: 4.8,
      deployedStaff: 14,
      monthlyValue: '₹2,10,000',
      activeTickets: 0,
      slaCompliance: '98.5%',
      punctuality: 4.9,
      contactPerson: 'Arunav Roy (+91 98800 11223)'
    },
    {
      id: 'VEND-02',
      name: 'Daikin Airconditioning India Pvt Ltd',
      category: 'HVAC & Climate Control AMC',
      contractEnd: '2027-03-31',
      isRenewingSoon: false,
      rating: 4.9,
      deployedStaff: 2,
      monthlyValue: '₹85,000',
      activeTickets: 1,
      slaCompliance: '99.2%',
      punctuality: 4.8,
      contactPerson: 'K. Ramalingam (+91 97700 33445)'
    },
    {
      id: 'VEND-03',
      name: 'Tata Communications Ltd (Enterprise Data)',
      category: 'Primary Internet Leased Lines',
      contractEnd: '2026-11-30',
      isRenewingSoon: false,
      rating: 4.7,
      deployedStaff: 1,
      monthlyValue: '₹1,45,000',
      activeTickets: 1,
      slaCompliance: '97.8%',
      punctuality: 4.6,
      contactPerson: 'Sanjay Deshmukh (+91 98110 55667)'
    },
    {
      id: 'VEND-04',
      name: 'Blue Tokai Coffee Roasters',
      category: 'Pantry Beverage Consumables',
      contractEnd: '2026-09-20',
      isRenewingSoon: true,
      rating: 5.0,
      deployedStaff: 0,
      monthlyValue: '₹42,000',
      activeTickets: 0,
      slaCompliance: '100%',
      punctuality: 5.0,
      contactPerson: 'Rahul Sen (+91 99000 77889)'
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'The Boardroom 7A reserved for Aug 30, 10:00 AM - 12:00 PM.',
      timestamp: '10 mins ago',
      isUnread: true,
      icon: 'event_available'
    },
    {
      id: 'NOTIF-2',
      type: 'ticket',
      title: 'SLA Escalation Alert',
      message: 'Ticket TICK-8021 has 30 minutes remaining before SLA breach.',
      timestamp: '25 mins ago',
      isUnread: true,
      icon: 'warning'
    },
    {
      id: 'NOTIF-3',
      type: 'invoice',
      title: 'August Invoice Released',
      message: 'Invoice INV-2026-08-01 approved and sent to Acme Innovations.',
      timestamp: '2 hours ago',
      isUnread: false,
      icon: 'receipt_long'
    },
    {
      id: 'NOTIF-4',
      type: 'access',
      title: 'Access Request Submitted',
      message: 'Kavita Sundaram submitted a new biometric access request for Suite 704.',
      timestamp: '3 hours ago',
      isUnread: false,
      icon: 'fingerprint'
    }
  ]);

  const [toasts, setToasts] = useState([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const addToast = (message, type = 'success', title = null) => {
    const id = `TOAST-${Date.now()}-${Math.random()}`;
    const newToast = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global Keyboard Shortcut for Command Palette (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [clientWallet, setClientWallet] = useState({
    monthlyQuota: 45,
    usedHours: 18,
    remainingHours: 27
  });

  const [selectedTicket, setSelectedTicket] = useState(null);

  // Hold Countdown Timer Effect
  useEffect(() => {
    let timer;
    if (activeHold && holdSecondsRemaining > 0) {
      timer = setInterval(() => {
        setHoldSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (holdSecondsRemaining === 0 && activeHold) {
      addToast('Your 5-minute room hold has expired and the slot has been released.', 'warning', 'Hold Expired');
      setActiveHold(null);
    }
    return () => clearInterval(timer);
  }, [activeHold, holdSecondsRemaining]);

  const startRoomHold = (room, slotDetails) => {
    setActiveHold({ room, ...slotDetails });
    setHoldSecondsRemaining(300); // 5 minutes
    addToast(`Placed temporary 5-minute hold on ${room.name}`, 'warning', 'Slot Reserved (Hold Active)');
  };

  const releaseRoomHold = () => {
    setActiveHold(null);
    setHoldSecondsRemaining(300);
  };

  const confirmRoomBooking = (bookingData) => {
    setBookings([bookingData, ...bookings]);
    if (bookingData.entitlementHours > 0) {
      setClientWallet((prev) => ({
        ...prev,
        usedHours: prev.usedHours + bookingData.entitlementHours,
        remainingHours: Math.max(0, prev.remainingHours - bookingData.entitlementHours)
      }));
    }
    releaseRoomHold();
    addToast(`Reservation confirmed for ${bookingData.room}!`, 'success', 'Booking Locked');
    // Add notification
    setNotifications([
      {
        id: `NOTIF-${Date.now()}`,
        type: 'booking',
        title: 'Meeting Room Confirmed',
        message: `${bookingData.room} booked for ${bookingData.date} (${bookingData.timeSlot}).`,
        timestamp: 'Just now',
        isUnread: true,
        icon: 'event_available'
      },
      ...notifications
    ]);
  };

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setCurrentUser(ROLES[roleKey]);
      if (roleKey === 'super_admin') {
        setCurrentScreen('executive_dashboard');
      } else if (roleKey === 'branch_admin') {
        setCurrentScreen('dashboard');
      } else if (roleKey === 'finance_user') {
        setCurrentScreen('invoices');
      } else if (roleKey === 'operations_facility') {
        setCurrentScreen('tickets');
      } else if (roleKey === 'client_admin') {
        setCurrentScreen('book_room');
      } else if (roleKey === 'security_guard') {
        setCurrentScreen('gate_pass');
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        activeBranch,
        setActiveBranch,
        activeCity,
        setActiveCity,
        currentScreen,
        setCurrentScreen,
        isSidebarOpen,
        setIsSidebarOpen,
        isNotificationOpen,
        setIsNotificationOpen,
        isAIChatOpen,
        setIsAIChatOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        addToast,
        removeToast,
        clients,
        setClients,
        meetingRooms,
        setMeetingRooms,
        bookings,
        setBookings,
        tickets,
        setTickets,
        selectedTicket,
        setSelectedTicket,
        visitors,
        setVisitors,
        invoices,
        setInvoices,
        expenses,
        setExpenses,
        accessRequests,
        setAccessRequests,
        notifications,
        setNotifications,
        inventoryItems,
        setInventoryItems,
        assets,
        setAssets,
        vendors,
        setVendors,
        clientWallet,
        setClientWallet,
        previewInvoice,
        setPreviewInvoice,
        isDarkMode,
        setIsDarkMode,
        activeHold,
        holdSecondsRemaining,
        startRoomHold,
        releaseRoomHold,
        confirmRoomBooking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
