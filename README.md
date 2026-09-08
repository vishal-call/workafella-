# Workafella-Demo

This repository is created to store and manage the source code for the Workafella OS web application, developed by Vishal specifically for demonstration and evaluation purposes.

---

## 🏢 About Workafella OS

**Workafella OS** is an enterprise-grade digital workspace platform tailored for premium co-working portfolios across India (Hyderabad, Chennai, Bangalore, Mumbai). It unifies multi-centre branch operations, enterprise client lifecycle management, real-time meeting room scheduling with quota protection, QR biometric gate passes, SLA-backed service desk triage, and automated GST billing.

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 2. Clone the Repository
```bash
git clone https://github.com/SAProduct/Workafella-Demo.git
cd Workafella-Demo
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🎭 Role-Based Access Control (RBAC)

The application includes 6 pre-configured personas ready for interactive demonstration:

| Persona Role | User Name | Scope & Authority | Demo Login Email |
|---|---|---|---|
| **Super Admin** | **Ananya Rao** | Enterprise CEO / Managing Director • All National Flagships | `ananya.rao@workafella.com` |
| **Branch Admin** | **Ramesh Kumar** | Centre General Manager • Hitec City Flagship | `ramesh.kumar@workafella.com` |
| **Finance Controller** | **Kavya Reddy** | Enterprise Billing, GST & Expense Audits | `kavya.reddy@workafella.com` |
| **Operations Manager** | **Arjun Mehta** | Facility Triage, Assets, Vendors & Work Orders | `arjun.mehta@workafella.com` |
| **Client Admin** | **Priya Sharma** | NovaTech Solutions Tenant Admin • Suite 704 & 705 | `priya.sharma@novatech.io` |
| **Security Officer** | **Suresh Goud** | Front Desk Gate Kiosk & QR Scanner | `suresh.goud@workafella.com` |

---

## 🌟 Core System Capabilities

1. **National Multi-Centre Command Center:** Real-time occupancy, revenue density, city filters (Hyderabad, Chennai, Bangalore, Mumbai), and geographic map visualization.
2. **Updated Space Allocation & Workspace Management:** 
   - **3-Tier Physical Hierarchy:** Full CRUD control for Floors, Rooms/Suites, and Individual Desks/Seats.
   - **Interactive 2D & 360° Visual Floorplan:** Live inventory status (`Vacant`, `Occupied`, `Reserved`, `Maintenance`) with 5-minute temporary reservation holds and direct mid-cycle pro-rata contract amendments.
   - **Workstation Desk Matrix & Bulk Generator:** Single-desk or bulk 1-click generation of sequential workstations with hardware tiering and power/LAN telemetry.
3. **Meeting Room Calendar Engine:** Day, Week, and 7-column Month views with multi-month scheduling, free credit quota enforcement, and automatic overage billing.
4. **Interactive Service Desk with SLA Shield:** 4-stage Kanban triage board, 1-click on-duty technician dispatch, voice incident notes, diagnostic checklists, and automated ₹2,500 SLA breach credit memos.
5. **Visitor Gate Pass & Biometrics:** Dynamic QR entry pass generation, instant turnstile clearance simulator, and digital NDA logs.
6. **Finance & Contract Automation:** Automated 18% GST invoices, PDF statement generation, and recurring expense approval workflows.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js 14 (App Router)
* **UI & Styling:** Tailwind CSS, Space Grotesk & Inter Typography, Material Symbols
* **Audio FX:** Web Audio API synthesizer for sensory UX feedback (zero external audio dependencies)
* **State Management:** React Context Architecture (`AppContext.jsx`) with reactive event synchronizer
* **Visual Effects:** Canvas Confetti & SVG Interactive Floor Layouts
