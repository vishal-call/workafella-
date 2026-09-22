'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { soundFx } from '../utils/audioEffects';

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
    name: 'Ananya Rao',
    roleLabel: 'Super Admin — Enterprise Managing Director',
    email: 'superadmin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    scope: 'All Branches (Enterprise National Portfolio)'
  },
  branch_admin: {
    id: 'branch_admin',
    name: 'Ramesh Kumar',
    roleLabel: 'Branch Admin — Hitec City',
    email: 'branchadmin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City, Hyderabad'
  },
  finance_user: {
    id: 'finance_user',
    name: 'Kavya Reddy',
    roleLabel: 'Finance Controller',
    email: 'finance@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    scope: 'Enterprise Finance & Billing'
  },
  operations_facility: {
    id: 'operations_facility',
    name: 'Arjun Mehta',
    roleLabel: 'Operations & Facility Manager',
    email: 'operationsmanager@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City, Hyderabad'
  },
  client_admin: {
    id: 'client_admin',
    name: 'Priya Sharma',
    roleLabel: 'Client Admin — NovaTech Solutions',
    email: 'clientadmin@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    scope: 'NovaTech Solutions (Suite 704 & 705)'
  },
  security_guard: {
    id: 'security_guard',
    name: 'Suresh Goud',
    roleLabel: 'Front Desk Security Officer',
    email: 'securityofficer@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    scope: 'Hitec City Gate Kiosk'
  }
};

export const AppProvider = ({ children }) => {
  // Navigation & Authentication state
  const [currentUser, setCurrentUser] = useState(ROLES.branch_admin);
  const [activeBranch, setActiveBranch] = useState(CENTRES[0]);
  const [activeCity, setActiveCity] = useState('All Cities');
  const [currentScreen, setCurrentScreen] = useState('login');
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
      client: 'NovaTech Solutions Pvt Ltd',
      host: 'Priya Sharma',
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
      host: 'Priya Sharma (NovaTech Solutions)',
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
      company: 'Deloitte Consulting India',
      host: 'Ananya Rao (Super Admin)',
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
      name: 'Rahul Verma',
      phone: '+91 97788 99001',
      email: 'rahul.verma@cisco.com',
      company: 'Cisco Systems India',
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
      submittedBy: 'Arjun Mehta (Ops)',
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
      submittedBy: 'Arjun Mehta (Ops)',
      status: 'Approved',
      receiptUrl: 'cleanpro_facility_invoice.pdf',
      isRecurring: true,
      vendor: 'CleanPro & SIS Facility Services LLP',
      description: 'Monthly housekeeping & 24/7 security guard deployment (14 staff).'
    },
    {
      id: 'EXP-903',
      centre: 'Hitec City',
      category: 'Asset-Related',
      subcategory: 'Voltas & Daikin VRV Chiller Overhaul',
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
      subcategory: 'Pantry & Organic Coffee Bean Consumables',
      amount: 42000,
      date: '2026-08-27',
      submittedBy: 'Chandana Reddy (Ops)',
      status: 'Approved',
      receiptUrl: 'blue_tokai_invoice.pdf',
      isRecurring: true,
      description: '100kg Arabica Roast beans, tea selections, organic sweeteners.'
    }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    {
      id: 'ACC-3101',
      employeeName: 'Neha Kapoor',
      email: 'neha.k@novatech.io',
      company: 'NovaTech Solutions Pvt Ltd',
      centre: 'Hitec City',
      floorRoom: 'Floor 7 / Suite 704',
      scope: ['24/7 Building Turnstile', 'Suite 704 Smart Lock', '7th Floor Meeting Rooms'],
      status: 'Under Review',
      submittedDate: '2026-08-29',
      idDocument: 'neha_aadhaar_masked.pdf',
      biometricStatus: 'Pending Verification'
    },
    {
      id: 'ACC-3102',
      employeeName: 'Sandeep Reddy',
      email: 'sandeep.r@acmeinnovations.io',
      company: 'Acme Innovations Pvt Ltd',
      centre: 'Hitec City',
      floorRoom: 'Floor 7 / Suite 705',
      scope: ['24/7 Building Turnstile', 'Suite 705 Smart Lock'],
      status: 'Enrollment Pending',
      submittedDate: '2026-08-28',
      idDocument: 'sandeep_passport_scan.pdf',
      biometricStatus: 'Ready for Physical Capture'
    },
    {
      id: 'ACC-3103',
      employeeName: 'Dr. Srinivas Rao',
      email: 'srinivas.r@quantumbio.com',
      company: 'Quantum BioLabs',
      centre: 'Hitec City',
      floorRoom: 'Floor 6 / Lab 601',
      scope: ['24/7 Building Turnstile', 'Lab 601 Bio-Lock', 'Level 6 Penthouse Lounge'],
      status: 'Active',
      submittedDate: '2026-08-20',
      idDocument: 'srinivas_aadhaar_verified.pdf',
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

  // Comprehensive Enterprise GST Input Tax Credit (ITC) Reconciliation Ledger
  const [gstRecords, setGstRecords] = useState([
    {
      id: 'GST-REC-01',
      vendorId: 'VEND-01',
      vendorName: 'SIS Security & Facility Services LLP',
      vendorGstin: '36AAAFS1234F1Z8',
      category: 'Security & Manned Guarding',
      centre: 'Hitec City',
      state: 'Telangana',
      invoiceNumber: 'SIS-2026-0811',
      invoiceDate: '2026-08-01',
      hsnSac: '998525',
      taxableValue: 210000,
      gstRate: 18,
      cgstBooks: 18900,
      sgstBooks: 18900,
      igstBooks: 0,
      taxInBooks: 37800,
      taxIn2B: 37800,
      status: 'Matched', // 'Matched' | 'Value Mismatch' | 'Missing in 2B' | 'Blocked / Sec 17(5)'
      variance: 0,
      paymentStatus: 'Released', // 'Released' | 'On Hold'
      lastNoticeSent: null,
      notes: '100% matched with GSTR-2B feed. Claimable under Table 4(A)(5) of GSTR-3B.'
    },
    {
      id: 'GST-REC-02',
      vendorId: 'VEND-02',
      vendorName: 'Daikin Airconditioning India Pvt Ltd',
      vendorGstin: '36AAACD5566G1Z2',
      category: 'HVAC & Climate Control AMC',
      centre: 'Western Aqua',
      state: 'Telangana',
      invoiceNumber: 'DKN-2026-904',
      invoiceDate: '2026-08-05',
      hsnSac: '998717',
      taxableValue: 85000,
      gstRate: 18,
      cgstBooks: 7650,
      sgstBooks: 7650,
      igstBooks: 0,
      taxInBooks: 15300,
      taxIn2B: 15300,
      status: 'Matched',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: 'Monthly central chiller maintenance fee reconciled successfully.'
    },
    {
      id: 'GST-REC-03',
      vendorId: 'VEND-03',
      vendorName: 'Tata Communications Ltd (Enterprise Data)',
      vendorGstin: '29AAACT9900H1Z5',
      category: 'Primary Internet Leased Lines',
      centre: 'Millers Road',
      state: 'Karnataka',
      invoiceNumber: 'TCL-2026-781',
      invoiceDate: '2026-08-02',
      hsnSac: '998422',
      taxableValue: 145000,
      gstRate: 18,
      cgstBooks: 0,
      sgstBooks: 0,
      igstBooks: 26100,
      taxInBooks: 26100,
      taxIn2B: 26100,
      status: 'Matched',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: '1 Gbps redundant enterprise optical fibre circuit. IGST credit verified.'
    },
    {
      id: 'GST-REC-04',
      vendorId: 'VEND-05',
      vendorName: 'Knight Frank Facility Management India',
      vendorGstin: '27AAACK1122J1Z3',
      category: 'Integrated Facility & MEP AMC',
      centre: 'BKC One',
      state: 'Maharashtra',
      invoiceNumber: 'KF-2026-1082',
      invoiceDate: '2026-08-03',
      hsnSac: '998533',
      taxableValue: 450000,
      gstRate: 18,
      cgstBooks: 0,
      sgstBooks: 0,
      igstBooks: 81000,
      taxInBooks: 81000,
      taxIn2B: 81000,
      status: 'Matched',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: 'Multi-skilled technical facility manpower services. Full credit eligible.'
    },
    {
      id: 'GST-REC-05',
      vendorId: 'VEND-06',
      vendorName: 'CleanPro Facility & Janitorial Solutions',
      vendorGstin: '33AAACC4455K1Z9',
      category: 'Housekeeping & Sanitization',
      centre: 'Guindy Cybervale',
      state: 'Tamil Nadu',
      invoiceNumber: 'CP-2026-881',
      invoiceDate: '2026-08-10',
      hsnSac: '998533',
      taxableValue: 250000,
      gstRate: 18,
      cgstBooks: 22500,
      sgstBooks: 22500,
      igstBooks: 0,
      taxInBooks: 45000,
      taxIn2B: 36000,
      status: 'Value Mismatch',
      variance: -9000,
      paymentStatus: 'On Hold',
      lastNoticeSent: '2026-09-14',
      notes: 'Vendor declared ₹2.0L in GSTR-1 instead of actual ₹2.5L invoice. ₹9,000 credit variance flagged.'
    },
    {
      id: 'GST-REC-06',
      vendorId: 'VEND-07',
      vendorName: 'Apex Powertech & Diesel Generators',
      vendorGstin: '36AAACA8899L1Z1',
      category: 'DG Backup & HT Transformer AMC',
      centre: 'Banjara Hills',
      state: 'Telangana',
      invoiceNumber: 'APX-2026-312',
      invoiceDate: '2026-08-08',
      hsnSac: '998719',
      taxableValue: 320000,
      gstRate: 18,
      cgstBooks: 28800,
      sgstBooks: 28800,
      igstBooks: 0,
      taxInBooks: 57600,
      taxIn2B: 0,
      status: 'Missing in 2B',
      variance: -57600,
      paymentStatus: 'On Hold',
      lastNoticeSent: '2026-09-12',
      notes: 'Vendor has NOT filed GSTR-1 for August. At risk of losing ₹57,600 input credit. September AP tranche locked.'
    },
    {
      id: 'GST-REC-07',
      vendorId: 'VEND-08',
      vendorName: 'KONE Elevators India Pvt Ltd',
      vendorGstin: '36AAACK6677M1Z4',
      category: 'Lift & Vertical Transport AMC',
      centre: 'Western Aqua',
      state: 'Telangana',
      invoiceNumber: 'KN-2026-402',
      invoiceDate: '2026-08-07',
      hsnSac: '998717',
      taxableValue: 110000,
      gstRate: 18,
      cgstBooks: 9900,
      sgstBooks: 9900,
      igstBooks: 0,
      taxInBooks: 19800,
      taxIn2B: 19800,
      status: 'Matched',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: 'Automated passenger elevator AMC with 24/7 breakdown coverage.'
    },
    {
      id: 'GST-REC-08',
      vendorId: 'VEND-09',
      vendorName: 'UrbanSpace Modular Interiors & Fitouts',
      vendorGstin: '36AAACU3344N1Z6',
      category: 'Acoustic Pods & Executive Chairs CAPEX',
      centre: 'Hitec City',
      state: 'Telangana',
      invoiceNumber: 'USB-2026-199',
      invoiceDate: '2026-08-12',
      hsnSac: '940310',
      taxableValue: 850000,
      gstRate: 18,
      cgstBooks: 76500,
      sgstBooks: 76500,
      igstBooks: 0,
      taxInBooks: 153000,
      taxIn2B: 0,
      status: 'Missing in 2B',
      variance: -153000,
      paymentStatus: 'On Hold',
      lastNoticeSent: '2026-09-11',
      notes: 'High-value CAPEX fitouts. Vendor delayed quarterly GSTR-1 return. ₹1,53,000 credit locked.'
    },
    {
      id: 'GST-REC-09',
      vendorId: 'VEND-04',
      vendorName: 'Blue Tokai Coffee Roasters',
      vendorGstin: '36AAACB2233P1Z7',
      category: 'Pantry Beverage Consumables',
      centre: 'Hitec City',
      state: 'Telangana',
      invoiceNumber: 'BT-2026-667',
      invoiceDate: '2026-08-04',
      hsnSac: '090121',
      taxableValue: 120000,
      gstRate: 5,
      cgstBooks: 3000,
      sgstBooks: 3000,
      igstBooks: 0,
      taxInBooks: 6000,
      taxIn2B: 6000,
      status: 'Blocked / Sec 17(5)',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: 'Ineligible ITC under Section 17(5)(b)(i) of CGST Act (Food & Beverages consumed on premises). Auto-reversed in 3B.'
    },
    {
      id: 'GST-REC-10',
      vendorId: 'VEND-10',
      vendorName: 'Airtel Business Enterprise Broadband',
      vendorGstin: '29AAACA1010Q1Z0',
      category: 'Secondary Leased Line & WiFi 6',
      centre: 'Residency Road',
      state: 'Karnataka',
      invoiceNumber: 'AB-2026-553',
      invoiceDate: '2026-08-06',
      hsnSac: '998422',
      taxableValue: 95000,
      gstRate: 18,
      cgstBooks: 0,
      sgstBooks: 0,
      igstBooks: 17100,
      taxInBooks: 17100,
      taxIn2B: 17100,
      status: 'Matched',
      variance: 0,
      paymentStatus: 'Released',
      lastNoticeSent: null,
      notes: 'Redundant leased-line failover link. Full IGST credit eligible.'
    }
  ]);

  // Comprehensive Enterprise Lease Agreements & Expiry Pipeline
  const [leaseContracts, setLeaseContracts] = useState([
    {
      id: 'LSE-2025-089',
      clientId: 'CL-102',
      clientName: 'Zenith Systems & AI',
      legalEntity: 'Zenith AI Solutions India Pvt Ltd',
      centre: 'Hitec City',
      suites: ['Suite 702 (15 Seats)', 'Suite 708 (5 Seats)'],
      seats: 20,
      baseRatePerSeat: 15000,
      monthlyRent: 300000,
      depositAmount: 600000,
      contractStart: '2025-06-01',
      contractEnd: '2026-09-30',
      daysToExpiry: 15,
      stage: 'Critical (< 30 Days)',
      churnRisk: 'High',
      proposedEscalation: 6,
      newTermMonths: 11,
      keyContact: 'Tanmay Saxena (VP Operations)',
      contactEmail: 'tanmay.s@zenithai.io',
      notes: 'Tenant considering expansion to 25 seats if +6% escalation is capped.'
    },
    {
      id: 'LSE-2025-064',
      clientId: 'CL-104',
      clientName: 'FinEdge Capital Partners',
      legalEntity: 'FinEdge Advisory Services LLP',
      centre: 'Millers Road',
      suites: ['Suite 402 (30 Seats)'],
      seats: 30,
      baseRatePerSeat: 16500,
      monthlyRent: 495000,
      depositAmount: 990000,
      contractStart: '2025-11-01',
      contractEnd: '2026-10-31',
      daysToExpiry: 46,
      stage: 'Proposal & Negotiation',
      churnRisk: 'Medium',
      proposedEscalation: 5,
      newTermMonths: 12,
      keyContact: 'Siddharth Roy (Partner)',
      contactEmail: 'siddharth@finedge.com',
      notes: 'Draft renewal proposal sent with 5% escalation. Awaiting board sign-off.'
    },
    {
      id: 'LSE-2025-045',
      clientId: 'CL-105',
      clientName: 'NovaTech Solutions Pvt Ltd',
      legalEntity: 'NovaTech Global Technologies India Pvt Ltd',
      centre: 'Hitec City',
      suites: ['Suite 704 (Enterprise Wing)', 'Suite 705 (15 Seats)'],
      seats: 45,
      baseRatePerSeat: 14500,
      monthlyRent: 652500,
      depositAmount: 1305000,
      contractStart: '2025-12-01',
      contractEnd: '2026-11-30',
      daysToExpiry: 76,
      stage: 'Upcoming (60-90 Days)',
      churnRisk: 'Low',
      proposedEscalation: 6,
      newTermMonths: 24,
      keyContact: 'Priya Sharma (HR & Workplace Director)',
      contactEmail: 'priya.s@novatech.io',
      notes: 'Initial check-in completed. Satisfied with facility uptime and leased-line SLA.'
    },
    {
      id: 'LSE-2026-012',
      clientId: 'CL-101',
      clientName: 'Acme Innovations Pvt Ltd',
      legalEntity: 'Acme Global Technologies India LLP',
      centre: 'Hitec City',
      suites: ['Suite 704 & 705 Private Wing'],
      seats: 45,
      baseRatePerSeat: 14500,
      monthlyRent: 652500,
      depositAmount: 1305000,
      contractStart: '2026-01-01',
      contractEnd: '2026-12-31',
      daysToExpiry: 107,
      stage: 'Healthy (> 90 Days)',
      churnRisk: 'Low',
      proposedEscalation: 6,
      newTermMonths: 11,
      keyContact: 'Ananya Sharma (Director of Admin)',
      contactEmail: 'ananya.s@acmeinnovations.io',
      notes: 'Healthy active account with high CSAT. Automated check-in scheduled for November.'
    },
    {
      id: 'LSE-2026-031',
      clientId: 'CL-103',
      clientName: 'Quantum BioLabs',
      legalEntity: 'Quantum Therapeutics Ltd',
      centre: 'Hitec City',
      suites: ['Suite 601, 602 & 603 (BioTech Wing)'],
      seats: 60,
      baseRatePerSeat: 14000,
      monthlyRent: 840000,
      depositAmount: 1680000,
      contractStart: '2026-03-01',
      contractEnd: '2027-02-28',
      daysToExpiry: 166,
      stage: 'Healthy (> 90 Days)',
      churnRisk: 'Low',
      proposedEscalation: 5,
      newTermMonths: 24,
      keyContact: 'Dr. Srinivas Rao (VP Operations)',
      contactEmail: 'srinivas.rao@quantumbio.com',
      notes: 'Custom laboratory lease with high capex infrastructure commitment.'
    }
  ]);

  // Comprehensive Physical Workspace Hierarchy (Floors, Rooms, Seats)
  const [floors, setFloors] = useState([
    {
      id: 'FL-06',
      name: 'Floor 6',
      level: 6,
      centre: 'Hitec City',
      totalArea: '14,000 sq.ft',
      description: 'Advanced Research Labs, Biotech Suites & Analytics Wing',
      status: 'Operational'
    },
    {
      id: 'FL-07',
      name: 'Floor 7',
      level: 7,
      centre: 'Hitec City',
      totalArea: '16,500 sq.ft',
      description: 'Enterprise Private Suites, Dedicated Wings & Executive Boardroom Hub',
      status: 'Operational'
    },
    {
      id: 'FL-08',
      name: 'Floor 8',
      level: 8,
      centre: 'Hitec City',
      totalArea: '15,000 sq.ft',
      description: 'High-Growth Tech Startups, Creator Media Pods & Penthouse Terrace',
      status: 'Operational'
    }
  ]);

  const [rooms, setRooms] = useState([
    // Floor 7 Rooms
    { id: 'RM-701', name: 'Suite 701', floorId: 'FL-07', floor: 'Floor 7', type: 'Private Office', capacity: 20, area: '1,200 sq.ft', baseRatePerSeat: 14500, status: 'Occupied', client: 'Cognizant Digital', amenities: ['Dedicated LAN', 'Biometric Smart Lock', 'Whiteboard', 'Executive Mesh Chairs'] },
    { id: 'RM-702', name: 'Suite 702', floorId: 'FL-07', floor: 'Floor 7', type: 'Private Office', capacity: 15, area: '950 sq.ft', baseRatePerSeat: 15000, status: 'Occupied', client: 'Zenith Systems & AI', amenities: ['Dedicated LAN', 'Biometric Lock', 'Acoustic Soundproofing'] },
    { id: 'RM-703', name: 'Suite 703', floorId: 'FL-07', floor: 'Floor 7', type: 'Private Office', capacity: 25, area: '1,500 sq.ft', baseRatePerSeat: 14000, status: 'Available', client: 'Vacant Space', amenities: ['4K Smart Display', 'Dual Router Ports', 'Motorized Standing Desks'] },
    { id: 'RM-704', name: 'Suite 704', floorId: 'FL-07', floor: 'Floor 7', type: 'Enterprise Wing', capacity: 30, area: '1,800 sq.ft', baseRatePerSeat: 14500, status: 'Occupied', client: 'NovaTech Solutions Pvt Ltd', amenities: ['Private Glass Cabin', 'Dedicated Server Rack', 'Keyless Bio-Access'] },
    { id: 'RM-705', name: 'Suite 705', floorId: 'FL-07', floor: 'Floor 7', type: 'Private Office', capacity: 15, area: '900 sq.ft', baseRatePerSeat: 14500, status: 'Occupied', client: 'NovaTech Solutions Pvt Ltd', amenities: ['Conference Pod', 'Ergonomic Mesh Chairs'] },
    { id: 'RM-706', name: 'Suite 706', floorId: 'FL-07', floor: 'Floor 7', type: 'Private Office', capacity: 15, area: '920 sq.ft', baseRatePerSeat: 15000, status: 'Available', client: 'Vacant Space', amenities: ['Natural Light Window View', 'Dual 24-inch Monitor Arms'] },
    { id: 'RM-707', name: 'The Boardroom 7A', floorId: 'FL-07', floor: 'Floor 7', type: 'Meeting Room', capacity: 16, area: '650 sq.ft', baseRatePerSeat: 2500, status: 'Meeting Room', client: 'Conference Suite', amenities: ['4K Dual Display', 'Polycom Mic Array', 'Crestron Console'] },
    { id: 'RM-708', name: 'Creator Pod Alpha', floorId: 'FL-07', floor: 'Floor 7', type: 'Meeting Room', capacity: 4, area: '200 sq.ft', baseRatePerSeat: 1200, status: 'Meeting Room', client: 'Media Lab', amenities: ['Podcast Mic', 'Ring Light', 'Sound Dampening'] },

    // Floor 6 Rooms
    { id: 'RM-601', name: 'Lab 601', floorId: 'FL-06', floor: 'Floor 6', type: 'Custom Built Lab', capacity: 30, area: '2,000 sq.ft', baseRatePerSeat: 14000, status: 'Occupied', client: 'Quantum BioLabs', amenities: ['Cleanroom Air Filtration', 'ESD Anti-Static Flooring', 'UPS 3-Phase Power'] },
    { id: 'RM-602', name: 'Lab 602', floorId: 'FL-06', floor: 'Floor 6', type: 'Custom Built Lab', capacity: 30, area: '2,000 sq.ft', baseRatePerSeat: 14000, status: 'Occupied', client: 'Quantum BioLabs', amenities: ['Isolated Server Rack', 'Chemical-Resistant Benches'] },
    { id: 'RM-604', name: 'Suite 604', floorId: 'FL-06', floor: 'Floor 6', type: 'Private Office', capacity: 18, area: '1,100 sq.ft', baseRatePerSeat: 15500, status: 'Occupied', client: 'FinEdge Capital', amenities: ['Private Glass Cabin', 'Safe Lock Vault', 'Lounge Seating'] },

    // Floor 8 Rooms
    { id: 'RM-801', name: 'Suite 801', floorId: 'FL-08', floor: 'Floor 8', type: 'Private Office', capacity: 20, area: '1,200 sq.ft', baseRatePerSeat: 15000, status: 'Available', client: 'Vacant Space', amenities: ['Penthouse Skyline View', 'Executive Lounge Access'] },
    { id: 'RM-802', name: 'Suite 802', floorId: 'FL-08', floor: 'Floor 8', type: 'Private Office', capacity: 15, area: '900 sq.ft', baseRatePerSeat: 15000, status: 'Available', client: 'Vacant Space', amenities: ['High Ceiling', 'Direct Elevator Proximity'] },
    { id: 'RM-803', name: 'Suite 803', floorId: 'FL-08', floor: 'Floor 8', type: 'Custom Built Wing', capacity: 40, area: '2,400 sq.ft', baseRatePerSeat: 14000, status: 'Occupied', client: 'Infosys FinTech', amenities: ['Internal Server Pod', 'Cafeteria Direct Access'] },
    { id: 'RM-804', name: 'Executive Boardroom 8B', floorId: 'FL-08', floor: 'Floor 8', type: 'Meeting Room', capacity: 20, area: '800 sq.ft', baseRatePerSeat: 3000, status: 'Meeting Room', client: 'VIP Conference', amenities: ['Motorized Dropdown 4K Laser Screen', 'Barista Coffee Bar'] }
  ]);

  const [seats, setSeats] = useState(() => {
    const initialSeats = [];
    // Generate starter structured seats for suites
    const defaultRoomCapacities = [
      { roomId: 'RM-704', prefix: 'D-704', count: 30, client: 'NovaTech Solutions Pvt Ltd', status: 'Occupied', deskType: 'Ergonomic Standing Desk' },
      { roomId: 'RM-705', prefix: 'D-705', count: 15, client: 'NovaTech Solutions Pvt Ltd', status: 'Occupied', deskType: 'Executive Leather Desk' },
      { roomId: 'RM-703', prefix: 'D-703', count: 25, client: 'Vacant Space', status: 'Available', deskType: 'Dual-Monitor Developer Bay' },
      { roomId: 'RM-701', prefix: 'D-701', count: 20, client: 'Cognizant Digital', status: 'Occupied', deskType: 'Standard Dedicated Desk' },
      { roomId: 'RM-702', prefix: 'D-702', count: 15, client: 'Zenith Systems & AI', status: 'Occupied', deskType: 'Ergonomic Standing Desk' },
      { roomId: 'RM-706', prefix: 'D-706', count: 15, client: 'Vacant Space', status: 'Available', deskType: 'Dual-Monitor Developer Bay' },
      { roomId: 'RM-601', prefix: 'D-601', count: 30, client: 'Quantum BioLabs', status: 'Occupied', deskType: 'Lab Workstation' },
      { roomId: 'RM-602', prefix: 'D-602', count: 30, client: 'Quantum BioLabs', status: 'Occupied', deskType: 'Lab Workstation' },
      { roomId: 'RM-604', prefix: 'D-604', count: 18, client: 'FinEdge Capital', status: 'Occupied', deskType: 'Executive Leather Desk' },
      { roomId: 'RM-801', prefix: 'D-801', count: 20, client: 'Vacant Space', status: 'Available', deskType: 'Standard Dedicated Desk' },
      { roomId: 'RM-802', prefix: 'D-802', count: 15, client: 'Vacant Space', status: 'Available', deskType: 'Standard Dedicated Desk' },
      { roomId: 'RM-803', prefix: 'D-803', count: 40, client: 'Infosys FinTech', status: 'Occupied', deskType: 'Dual-Monitor Developer Bay' }
    ];

    defaultRoomCapacities.forEach(({ roomId, prefix, count, client, status, deskType }) => {
      for (let i = 1; i <= count; i++) {
        const seatNum = `${prefix}-${i < 10 ? '0' + i : i}`;
        initialSeats.push({
          id: `ST-${roomId}-${i}`,
          roomId,
          seatNumber: seatNum,
          deskType,
          status,
          assignedTo: status === 'Occupied' ? client : 'Unassigned',
          powerLanStatus: 'Active',
          amenities: ['Power Socket 230V', 'RJ45 LAN 1Gbps', 'Lockable Pedestal']
        });
      }
    });

    return initialSeats;
  });

  // Workspace Structure CRUD Actions
  const addFloor = (floorData) => {
    const newFloor = {
      id: `FL-${Date.now().toString().slice(-4)}`,
      status: 'Operational',
      ...floorData
    };
    setFloors((prev) => [...prev, newFloor]);
    addToast(`Floor "${newFloor.name}" created successfully!`, 'success', 'Floor Added');
  };

  const updateFloor = (floorId, updatedData) => {
    setFloors((prev) => prev.map((f) => (f.id === floorId ? { ...f, ...updatedData } : f)));
    addToast('Floor details updated successfully!', 'success', 'Floor Updated');
  };

  const deleteFloor = (floorId) => {
    const targetFloor = floors.find((f) => f.id === floorId);
    setFloors((prev) => prev.filter((f) => f.id !== floorId));
    // Remove associated rooms and seats
    const floorRoomIds = rooms.filter((r) => r.floorId === floorId).map((r) => r.id);
    setRooms((prev) => prev.filter((r) => r.floorId !== floorId));
    setSeats((prev) => prev.filter((s) => !floorRoomIds.includes(s.roomId)));
    addToast(`Removed ${targetFloor?.name || 'Floor'} and its associated inventory.`, 'info', 'Floor Removed');
  };

  const addRoom = (roomData) => {
    const newRoom = {
      id: `RM-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Available',
      client: 'Vacant Space',
      amenities: ['Power Sockets', 'LAN Connectivity', 'Executive Chairs'],
      ...roomData
    };
    setRooms((prev) => [...prev, newRoom]);

    // Auto-generate desks for the new room's capacity
    const initialDesks = [];
    const capacity = Number(newRoom.capacity) || 10;
    const prefix = `D-${newRoom.name.replace(/[^0-9]/g, '') || 'R'}`;
    for (let i = 1; i <= capacity; i++) {
      initialDesks.push({
        id: `ST-${newRoom.id}-${i}`,
        roomId: newRoom.id,
        seatNumber: `${prefix}-${i < 10 ? '0' + i : i}`,
        deskType: 'Standard Dedicated Desk',
        status: newRoom.status === 'Occupied' ? 'Occupied' : 'Available',
        assignedTo: newRoom.client || 'Unassigned',
        powerLanStatus: 'Active',
        amenities: ['Power Socket', 'LAN RJ45']
      });
    }
    setSeats((prev) => [...prev, ...initialDesks]);

    addToast(`Room "${newRoom.name}" added with ${capacity} workstation desks!`, 'success', 'Room Created');
  };

  const updateRoom = (roomId, updatedData) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, ...updatedData } : r)));
    addToast('Room configurations updated!', 'success', 'Room Saved');
  };

  const deleteRoom = (roomId) => {
    const targetRoom = rooms.find((r) => r.id === roomId);
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    setSeats((prev) => prev.filter((s) => s.roomId !== roomId));
    addToast(`Removed room ${targetRoom?.name || ''} and its seats.`, 'info', 'Room Removed');
  };

  const addSeat = (seatData) => {
    const newSeat = {
      id: `ST-${Date.now()}-${Math.random()}`,
      status: 'Available',
      assignedTo: 'Unassigned',
      powerLanStatus: 'Active',
      ...seatData
    };
    setSeats((prev) => [...prev, newSeat]);
    // update room capacity count
    if (seatData.roomId) {
      setRooms((prev) =>
        prev.map((r) => (r.id === seatData.roomId ? { ...r, capacity: Number(r.capacity) + 1 } : r))
      );
    }
    addToast(`Desk ${newSeat.seatNumber} added!`, 'success', 'Seat Created');
  };

  const bulkAddSeats = (roomId, count, prefix = 'D-', deskType = 'Ergonomic Standing Desk', status = 'Available') => {
    const existingRoomSeats = seats.filter((s) => s.roomId === roomId);
    const startIdx = existingRoomSeats.length + 1;
    const newSeatsList = [];
    for (let i = 0; i < count; i++) {
      const num = startIdx + i;
      newSeatsList.push({
        id: `ST-${roomId}-${num}-${Date.now()}`,
        roomId,
        seatNumber: `${prefix}${num < 10 ? '0' + num : num}`,
        deskType,
        status,
        assignedTo: status === 'Occupied' ? 'Assigned' : 'Unassigned',
        powerLanStatus: 'Active',
        amenities: ['Power Socket 230V', 'High-Speed LAN RJ45']
      });
    }
    setSeats((prev) => [...prev, ...newSeatsList]);
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, capacity: Number(r.capacity) + Number(count) } : r))
    );
    addToast(`Bulk generated ${count} desks in room!`, 'success', 'Seats Generated');
  };

  const updateSeat = (seatId, updatedData) => {
    setSeats((prev) => prev.map((s) => (s.id === seatId ? { ...s, ...updatedData } : s)));
    addToast('Workstation desk updated!', 'success', 'Seat Saved');
  };

  const deleteSeat = (seatId) => {
    const targetSeat = seats.find((s) => s.id === seatId);
    setSeats((prev) => prev.filter((s) => s.id !== seatId));
    if (targetSeat?.roomId) {
      setRooms((prev) =>
        prev.map((r) => (r.id === targetSeat.roomId ? { ...r, capacity: Math.max(0, Number(r.capacity) - 1) } : r))
      );
    }
    addToast('Seat removed.', 'info', 'Seat Deleted');
  };

  const renewContract = (contractId, renewalData) => {
    setLeaseContracts((prev) =>
      prev.map((c) => {
        if (c.id === contractId) {
          return {
            ...c,
            ...renewalData,
            stage: 'Renewed',
            status: 'Active',
            daysToExpiry: renewalData.newTermMonths ? renewalData.newTermMonths * 30 : 365
          };
        }
        return c;
      })
    );

    // Also synchronize client in clients state
    const targetContract = leaseContracts.find((c) => c.id === contractId);
    if (targetContract) {
      setClients((prev) =>
        prev.map((cl) => {
          if (cl.id === targetContract.clientId || cl.name === targetContract.clientName) {
            return {
              ...cl,
              ratePerSeat: renewalData.baseRatePerSeat || cl.ratePerSeat,
              seats: renewalData.seats || cl.seats,
              contractEnd: renewalData.contractEnd || cl.contractEnd,
              status: 'Active',
              churnRisk: 'Low'
            };
          }
          return cl;
        })
      );
    }

    addToast(`Contract ${contractId} successfully renewed & addendum executed!`, 'success', 'Lease Renewed');
  };

  const updateContractStage = (contractId, newStage) => {
    setLeaseContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, stage: newStage } : c))
    );
    addToast(`Contract moved to "${newStage}" stage.`, 'info', 'Pipeline Updated');
  };

  const markContractMoveOut = (contractId, settlementDetails) => {
    const targetContract = leaseContracts.find((c) => c.id === contractId);
    setLeaseContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? { ...c, stage: 'Notice to Vacate / Exited', status: 'Vacated', settlement: settlementDetails }
          : c
      )
    );

    if (targetContract) {
      setClients((prev) =>
        prev.map((cl) =>
          cl.id === targetContract.clientId || cl.name === targetContract.clientName
            ? { ...cl, status: 'Vacated', churnRisk: 'Exited' }
            : cl
        )
      );
    }

    addToast(`Move-out inspection & deposit settlement recorded for ${targetContract?.clientName || contractId}.`, 'warning', 'Space Released');
  };

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

  // GST Reconciliation Operations
  const runGstBatchReconciliation = () => {
    soundFx?.playChime?.();
    setGstRecords((prev) =>
      prev.map((rec) => {
        if (rec.status === 'Missing in 2B' && rec.id === 'GST-REC-06') {
          return {
            ...rec,
            taxIn2B: rec.taxInBooks,
            status: 'Matched',
            variance: 0,
            paymentStatus: 'Released',
            notes: 'Reconciled via automated API sync. Vendor GSTR-1 ARN #AA3608260012948 confirmed.'
          };
        }
        return rec;
      })
    );
    addToast('GSTR-2B API feed synced. Recovered ₹57,600 in verified Input Tax Credit!', 'success', 'Reconciliation Completed');
  };

  const sendVendorGstNotice = (recordId) => {
    soundFx?.playClick?.();
    const today = new Date().toISOString().split('T')[0];
    setGstRecords((prev) =>
      prev.map((rec) =>
        rec.id === recordId
          ? {
              ...rec,
              lastNoticeSent: today,
              notes: `${rec.notes} [Notice dispatched on ${today}: Section 16(2)(aa) statutory compliance warning].`
            }
          : rec
      )
    );
    const target = gstRecords.find((r) => r.id === recordId);
    addToast(`Automated GST non-compliance notice sent to ${target?.vendorName || 'Vendor'}.`, 'warning', 'Notice Dispatched');
  };

  const toggleVendorPaymentHold = (recordId) => {
    soundFx?.playClick?.();
    let updatedStatus = 'Released';
    setGstRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          updatedStatus = rec.paymentStatus === 'Released' ? 'On Hold' : 'Released';
          return { ...rec, paymentStatus: updatedStatus };
        }
        return rec;
      })
    );
    const target = gstRecords.find((r) => r.id === recordId);
    if (updatedStatus === 'On Hold') {
      addToast(`Payment tranche locked for ${target?.vendorName}. Awaiting GSTR-1 upload.`, 'error', 'Payment Withheld');
    } else {
      addToast(`Payment hold released for ${target?.vendorName}. Approved for bank dispatch.`, 'success', 'Payment Released');
    }
  };

  const resolveGstMismatch = (recordId, debitNoteAmount = 0, resolutionNotes = '') => {
    soundFx?.playChime?.();
    setGstRecords((prev) =>
      prev.map((rec) => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: 'Matched',
            variance: 0,
            paymentStatus: 'Released',
            notes: resolutionNotes || `Debit note of ₹${debitNoteAmount || 9000} accepted. Matched to revised GSTR-2B entry.`
          };
        }
        return rec;
      })
    );
    addToast(`Variance resolved & matched for record ${recordId}. Full remaining credit claimed.`, 'success', 'Mismatch Resolved');
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
        floors,
        setFloors,
        rooms,
        setRooms,
        seats,
        setSeats,
        addFloor,
        updateFloor,
        deleteFloor,
        addRoom,
        updateRoom,
        deleteRoom,
        addSeat,
        bulkAddSeats,
        updateSeat,
        deleteSeat,
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
        confirmRoomBooking,
        leaseContracts,
        setLeaseContracts,
        renewContract,
        updateContractStage,
        markContractMoveOut,
        gstRecords,
        setGstRecords,
        runGstBatchReconciliation,
        sendVendorGstNotice,
        toggleVendorPaymentHold,
        resolveGstMismatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
