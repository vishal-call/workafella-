# 🏢 Workafella — Enterprise Digital Workspace Platform

An enterprise-grade, multi-role digital workspace operations platform for co-working spaces and managed offices. Built with **Next.js 14, React 18, and Tailwind CSS**, featuring real-time data synchronization across all branch operations, client portals, and executive cockpits.

---

## 🌟 Key Features & Modules

### 1. 👑 Executive Leadership & Super Admin
* **Multi-City Portfolio Cockpit:** Real-time telemetry tracking monthly revenue (₹4.82 Cr), national occupancy (88%), and 11 branches across Hyderabad, Chennai, Bangalore, and Mumbai.
* **Stacked Card Layering:** Interactive 3D physical card deck with rotation physics and click-to-shuffle interactions.
* **Strategic Financial Reports:** Automated EBITDA run rates, electricity cost efficiency, and AI-driven predictive churn risk models.

### 2. 📐 Branch Management & CAD Floor Blueprints
* **Interactive CAD Floor Map:** Live 3D architectural blueprint of Floor 7 with occupancy telemetry, vacancy filters, and 360° suite inspection drawers.
* **5-Step Client Onboarding Wizard:** Entity setup, contract term definition, blueprint suite allocation, and Client Admin provisioning with celebratory confetti.
* **Staff Directory & Shift Rosters:** On-duty operations rosters with direct call and WhatsApp actions.

### 3. 📅 Meeting Rooms & Dynamic Calendar Matrix
* **Multi-Month Room Calendar:** Switch seamlessly between **Month View**, **Week View**, and **Day View** with dynamic month navigation (August, September, October 2026).
* **5-Minute Temporary Hold Lock:** 300-second live anti-double-booking timer with visual warning below 60s.
* **Entitlement Wallet:** Automatically computes free hours vs. chargeable overage (e.g. 27/45 hrs remaining).
* **360° Virtual Ambience Tour:** 4-mode lighting simulator (*Warm Luxury, Cool Focus, Sunset Gold, Ambient Dark*).

### 4. 🛠️ SLA Incidents & Kanban Service Desk
* **Audio Voice Memo Incident Logging:** 12-second voice waveform recorder with auto-transcription for field problem statements.
* **Kanban Service Desk:** Visual incident triage with live SLA countdown telemetry (`🟢 Safe`, `🟡 Warning < 1h`, `🔴 Breached`).
* **SLA Breach Penalty Credit Memo:** Automatically calculates and issues ₹2,500 compensatory wallet credit on breach risks.
* **Technician Work-Order Checklist:** 4-step diagnostic protocol with CSAT 5-star rating submission.

### 5. 👥 Visitor Management & Security Gate Pass
* **Pre-Registration & Digital QR Passes:** Host pre-registration generating digitally signed QR passes.
* **Turnstile QR Scanner:** 1-click scan simulation to unlatch turnstile gates, record check-in/out timestamps, and notify hosts.
* **Security Watchlist Alerts:** Real-time red security banners on flagged individuals.

### 6. 💰 Finance, GST Invoicing & Expense Approvals
* **Automated GST Invoices:** Calculates monthly recurring seat lease + conference room overages + 18% GST (SAC: 997212).
* **Printable Tax Invoice Modal:** Government-compliant tax invoice template with reverse charge flags and printable PDF layout.
* **Client Self-Service Billing:** Invoices, line items, wallet quota, and 1-click corporate payment reconciliation.
* **Multi-Tier Expense Approvals:** Tier-1 Branch Admin approval + automatic routing to Finance Controller for high-value claims (>₹1,00,000).

### 7. 📦 Facility Assets & Consumable Inventory
* **Smart 1-Click Purchase Orders (PO):** Automated PO generator for low-stock consumables with 18% GST tax breakdowns.
* **Asset Register & AMC Maintenance:** Capital equipment register with dynamic Net Book Value calculation and printable digital QR equipment tags.
* **5-Star Vendor Scorecards:** Performance rating matrix (Punctuality, SLA Compliance, Quality) and 1-click 1-year contract extension generator.

---

## 💻 Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Library:** [React 18](https://react.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) with Custom Luxury Glassmorphism Theme
* **Icons:** Material Symbols & [Lucide Icons](https://lucide.dev/)
* **Audio FX:** Web Audio API & Sound synthesis
* **Visual Effects:** Canvas Confetti

---

## 🚀 Getting Started & Installation

Follow these simple steps to download, install, and run the project locally on your computer:

### Prerequisites

Ensure you have the following installed on your computer:
* **Node.js** (v18.17.0 or higher recommended) — [Download Node.js](https://nodejs.org/)
* **Git** — [Download Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
git clone https://github.com/vishal-call/workafella-.git
```

---

### Step 2: Navigate to the Project Directory

```bash
cd workafella-
```

---

### Step 3: Install Dependencies

Install all required npm packages:

```bash
npm install
```

---

### Step 4: Run the Development Server

Start the local Next.js dev server:

```bash
npm run dev
```

---

### Step 5: Open in Your Browser

Open your browser and navigate to:

👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🎭 How to Test the 6 User Roles

Workafella includes an instant **Role Switcher** docked at the **bottom-left of the sidebar**. Click any persona to test role-specific workflows:

| Role | Persona | Key Responsibilities to Test |
|---|---|---|
| 👑 **Super Admin** | Vikram Malhotra | Multi-city portfolio, stacked KPI cards, national P&L reports, AI churn risk. |
| 🏢 **Branch Admin** | Sarah Jenkins | 5-Step client onboarding wizard, 3D CAD floor plan, staff directory. |
| 💰 **Finance Controller** | Rohan Mehta | Monthly GST invoicing, bulk invoice dispatch, multi-tier expense sign-offs. |
| 🛠️ **Operations Manager** | Karthik Raja | Dynamic multi-month room calendar, Kanban service desk, inventory POs, asset QR tags. |
| 👤 **Client Admin** | Ananya Sharma (Acme / NovaTech) | Meeting room 5-min holds, wallet balance, support tickets with voice notes, visitor passes. |
| 🛡️ **Front Desk Security** | Suresh Kumar | Turnstile QR scan simulation, visitor logs, host arrival alerts. |

---

## 📦 Production Build

To test an optimized production build:

```bash
npm run build
npm run start
```

---

## 📄 License

Private and proprietary. Designed for Workafella Workspace Operations.
