# STATEMENT OF WORK (SOW)
## Enterprise Digital Workspace Operations Platform — Workafella

**Document Reference:** `WF-SOW-2026-V1.0`  
**Effective Date:** September 1, 2026  
**Project Title:** Workafella Digital Workspace OS & Multi-Branch Enterprise Management Platform  
**Client Entity:** Workafella Coworking & Managed Offices Pvt. Ltd.  
**Prepared By:** Advanced Software Architecture & Engineering Team  

---

## 1. Executive Summary

### 1.1 Purpose & Objective
This Statement of Work (SOW) defines the technical specifications, comprehensive deliverables, deployment architecture, milestone schedule, and commercial terms for the end-to-end delivery of the **Workafella Digital Workspace Platform**.

The platform is designed to replace fragmented legacy point-solutions with a unified, real-time operating system across **11 physical centres** (spanning Hyderabad, Chennai, Bangalore, and Mumbai). It automates the entire coworking lifecycle—from enterprise lead conversion and 3D CAD space allocation to GST billing, SLA incident triage, visitor turnstile gate passes, asset lifecycle tracking, and AI-driven retention intelligence.

### 1.2 Business Value & Impact
* **100% Operational Transparency:** Real-time visibility into portfolio occupancy (88%), monthly revenue collection (₹4.82 Cr), and live facility status.
* **Elimination of Double-Bookings:** 5-minute distributed temporary holds with real-time entitlement wallet deductions.
* **SLA Breach Mitigation:** Automated countdown telemetry with integrated compensation credit calculators.
* **Zero Billing Leakage:** Automated recurring seat leases + conference overage calculations + 18% GST (SAC: 997212) generation.
* **Turnkey Cloud Infrastructure:** High-availability deployment on **Hostinger Cloud VPS** with automated backups, SSL/TLS, reverse proxy, and PostgreSQL relational database.

---

## 2. Scope of Work & Deliverables

The scope comprises **13 Core Operational Modules**, **6 Role-Based Access Control (RBAC) Portals**, **Enterprise Database Engineering**, and **Hostinger Cloud Infrastructure Provisioning**.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           WORKAFELLA DIGITAL WORKSPACE OS                        │
├───────────────────┬───────────────────┬────────────────────┬─────────────────────┤
│  Super Admin      │   Branch Admin    │ Finance Controller │ Operations Manager  │
│  (11 Centres)     │ (Floor Blueprint) │   (GST Invoices)   │  (SLA / Inventory)  │
├───────────────────┴───────────────────┴────────────────────┴─────────────────────┤
│               Client Self-Service Portal & Front Desk Security Gateway           │
├──────────────────────────────────────────────────────────────────────────────────┤
│             Universal Real-Time State Bus & AI Agentic Intelligence              │
├──────────────────────────────────────────────────────────────────────────────────┤
│           PostgreSQL Database (Prisma ORM) & Hostinger Cloud Infrastructure       │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

### Module 1: Executive Command Center & Multi-Centre Governance
* **Multi-City Portfolio Telemetry:** Real-time tracking of revenue, national occupancy (88%), total seats (4,740), and active tenant counts.
* **Stacked Card Layering:** 3D physical card deck with rotation physics, z-index elevation, and click-to-shuffle interactions for top KPI metrics.
* **Branch Performance Comparison Matrix:** Tabular telemetry comparing yield, occupancy %, and open maintenance suites across all 11 locations.
* **Strategic P&L Reporting:** Automated run rates, electricity cost per desk analysis, and churn risk detection.

---

### Module 2: Space Allocation & 3D Interactive CAD Blueprint Engine
* **Interactive Floor Map:** SVG/CAD blueprint of Floor 7 with occupancy telemetry, vacancy filters, and 3D hover physics.
* **360° Suite Inspection Drawer:** 5-photo thumbnail gallery strip, 12-hour day heat bar, power/bandwidth specs, and 1-click workspace allocation.
* **Dynamic Pro-Rata Calculator:** Mid-cycle seat addition engine with transparent date math $\left(\text{Seats} \times \text{Rate} \times \frac{\text{Remaining Days}}{\text{Total Days}}\right)$.

---

### Module 3: Client Onboarding Wizard
* **5-Step Guided Onboarding:**
  1. *Legal & Entity Setup:* Captures PAN, GSTIN, billing address, and optional parent group linkage.
  2. *Contract & Commercial Terms:* Sets lock-in tenure, seat rate cards (₹15,000/seat), and free meeting hour quotas.
  3. *CAD Floor Allocation:* Multi-room selection with capacity guardrails to prevent overselling.
  4. *Client Admin Provisioning:* Automated credentials and activation dispatch.
  5. *Review & Activation:* Final contract validation with celebratory confetti burst.

---

### Module 4: Meeting Rooms, 360° Tours & Entitlement Wallets
* **Entitlement Wallet Ledger:** Dynamic free-hour tracking (e.g. 27/45 hrs remaining) with automatic overage rate computation.
* **5-Minute Temporary Hold Lock:** 300-second countdown with visual warning below 60s to prevent concurrency conflicts.
* **360° Room Ambience Visualizer:** Interactive lighting simulator (*Warm Luxury, Cool Focus, Sunset Gold, Ambient Dark*).
* **Multi-Month Centre-Wide Calendar:** Dynamic Month View (7-column grid), Week View (hourly slots), and Day View with `< Prev`, `Next >`, and `Today` navigation.
* **Automated Entitlement Restitution:** Releasing/cancelling bookings automatically credits hours back to the client wallet.

---

### Module 5: SLA Incidents, Tickets & Kanban Service Desk
* **Voice Note Incident Submission:** 12-second audio waveform recorder with simulated auto-transcription for field diagnostic notes.
* **Kanban Service Desk:** Visual incident triage with live SLA countdown telemetry (`🟢 Safe`, `🟡 Warning < 1h`, `🔴 Breached`).
* **SLA Breach Guarantee Credit Memo:** Automatically computes and deposits ₹2,500 compensatory credit to tenant wallet upon breach risk.
* **Technician Work-Order Checklist:** 4-step diagnostic checklist with progress tracking (`75% Complete`) and 5-star CSAT rating prompt upon resolution.

---

### Module 6: Visitor Management & Security Gate Pass
* **Pre-Registration & Signed QR Passes:** Client Admin host pre-registration generating unique signed QR codes (`WF-QR-889021`).
* **Turnstile QR Scanner:** 1-click scan simulation to validate QR, unlatch turnstile barrier, and timestamp check-in/out.
* **Instant Host Arrival Notification:** Dispatches real-time arrival alerts to the designated host.
* **Security Watchlist & Blacklist:** Immediate red security banners on flagged individuals before clearance.

---

### Module 7: Employee Biometric Access & KYC Review
* **Access Request Submission:** Client Admins submit employee access cards, zone scopes, and KYC proofs.
* **Masked KYC Review Modal:** High-security blurred Aadhaar/Passport KYC audit viewer.
* **Biometric Hardware Sync Tracker:** Tracks physical hardware capture and syncs status to `Active`.

---

### Module 8: Finance, GST Invoicing & Corporate Payments
* **Automated Monthly Invoicing:** Calculates base seat lease + conference room overages + 18% GST (SAC: 997212).
* **Printable Tax Invoice Modal:** Government GST-compliant tax invoice template with SAC codes, reverse charge flags, and printable PDF layout.
* **Client Self-Service Billing:** Tenant portal to inspect line items, download tax invoice PDFs, and simulate 1-click payments.
* **Bulk Dispatch:** 1-click release of approved invoices to client billing portals.

---

### Module 9: Branch Expense Approvals & P&L Analytics
* **Operational Expense Logging:** Categorized bill entry (Facility, Office, Vendor, AMC) with mandatory receipt attachment.
* **Multi-Tier Approval Workflow:** Tier-1 Branch Admin approval + automatic routing to Finance Controller for high-value claims ($> ₹1,00,000$).
* **Budget vs. Actual Donut Analytics:** Dynamic OPEX distribution charts and budget overrun alerts.

---

### Module 10: Consumable Supplies & Capital Asset Register
* **Live Inventory Stock Levels:** Tracked SKU register with inline steppers (`+10` / `-5`) and low-stock alerts.
* **1-Click Smart Purchase Orders (PO):** Pre-calculates vendor rates with 18% GST tax breakdowns and dispatches POs.
* **Asset Register & Net Book Value:** Capital equipment register with automatic category-prefix ID generation (`WF-AV-812`) and depreciation calculation.
* **Printable Digital QR Tag Generator:** Auto-generates printable QR labels (`🖨️ Print Equipment QR Label`) for physical asset tagging.
* **5-Star Vendor Scorecards:** SLA performance scorecard matrix (Punctuality, Quality, Compliance) with 1-click 1-year contract renewals.

---

### Module 11: AI Copilot & Predictive Intelligence Layer
* **Conversational AI Assistant:** Floating operations copilot answering natural language queries regarding bookings, tickets, and amenities.
* **Tenant Isolation Guardrails:** Client Admin queries strictly scoped to their own company's data.
* **Renewal Churn Risk Predictor:** 0–100 risk scoring algorithm (*Zenith Systems 78/100, Acme Innovations 24/100*) highlighting risk drivers.

---

### Module 12: Enterprise Database Engineering
* **Relational Database Engine:** PostgreSQL 16 schema modeled across all 11 domains with Prisma ORM.
* **ACID Transactions:** Concurrency-safe financial invoicing, wallet hour deductions, and space allocations.
* **Automated Data Seeder:** Complete canonical dataset (*NovaTech, Acme Innovations, Zenith Systems, Quantum BioLabs, Priya Sharma, Ramesh Kumar, Suresh*).
* **Connection Pooling & Singleton Client:** High-concurrency database connection management in Next.js.

---

### Module 13: Hostinger Cloud VPS & Production Deployment
* **Virtual Private Server (VPS):** Hostinger Cloud VPS running Ubuntu 22.04 LTS.
* **Process Management:** PM2 process manager configured for zero-downtime restarts and cluster mode.
* **Web Server & Reverse Proxy:** Nginx reverse proxy with gzip compression, caching, and rate limiting.
* **Security & SSL/TLS:** Automated Let's Encrypt SSL certificates (HTTPS) with auto-renewal and UFW firewall configuration.
* **Automated Nightly Backups:** Automated cron job backing up PostgreSQL database and storage assets with 30-day retention.
* **CI/CD Deployment Pipeline:** GitHub Webhook / Actions integration automatically pulling and rebuilding the latest code from `main`.

---

## 3. Project Timeline & Milestones

The project follows an agile 6-week delivery roadmap:

| Milestone | Phase & Deliverables | Timeline | Deliverable Acceptance |
|---|---|---|---|
| **M1: Architecture & Base Platform** | Next.js 14 App Shell, 6 RBAC Personas, Design System, Universal State Bus | Week 1 | Functional prototype with role switcher |
| **M2: Core Operations & Booking Engine** | CAD Floor Blueprint, Multi-Month Room Calendar, 5-Min Hold Lock, Wallets | Week 2 | Interactive floor map and room booking engine |
| **M3: Service Desk, Gate Pass & Biometrics** | SLA Kanban Desk, Voice Notes, QR Gate Passes, Biometric KYC Approvals | Week 3 | Live incident lifecycle and QR scan verification |
| **M4: Finance, GST Invoicing & Inventory** | Automated 18% GST Invoices, Multi-Tier Expenses, Asset QR Tags, Smart POs | Week 4 | End-to-end billing & asset management |
| **M5: Database & Hostinger Cloud Deployment** | PostgreSQL/Prisma Schema, Hostinger VPS, Nginx, SSL, CI/CD Pipeline | Week 5 | Staging deployment accessible via custom domain |
| **M6: QA, User Acceptance & Go-Live** | Security audit, multi-role UAT sign-off, staff training & production handover | Week 6 | Production Go-Live across 11 centres |

---

## 4. Pricing & Commercial Terms

### 4.1 Value-Engineered Commercial Comparison

| Deliverable Component | Market Standard Agency Cost | Value-Engineered Deal Price |
|---|---|---|
| **1. UI/UX Architecture & 6-Role Portals (30 Screens)** | ₹2,20,000 | **Included in Scope** |
| **2. Interactive CAD Floor Engine & 360° Tour Visualizers** | ₹1,50,000 | **Included in Scope** |
| **3. Multi-Month Calendar & 5-Minute Hold Concurrency Engine** | ₹1,20,000 | **Included in Scope** |
| **4. SLA Incident Service Desk with Voice Audio Transcription** | ₹95,000 | **Included in Scope** |
| **5. Automated GST Invoicing & Financial Ledger Engine** | ₹1,10,000 | **Included in Scope** |
| **6. Visitor Gate Pass & Biometric KYC Security Subsystem** | ₹85,000 | **Included in Scope** |
| **7. Consumables PO & Capital Asset QR Maintenance Register** | ₹75,000 | **Included in Scope** |
| **8. PostgreSQL Database & Prisma ORM Data Architecture** | ₹65,000 | **Included in Scope** |
| **9. Hostinger Cloud VPS Setup, Nginx, SSL & CI/CD DevOps** | ₹45,000 | **Included in Scope** |
| **10. Testing, UAT Support & 60-Day Post-Launch Warranty** | ₹60,000 | **Included in Scope** |
| **TOTAL VALUATION** | **₹10,25,000** | **₹3,75,000** *(Excl. GST)* |

> [!TIP]
> **Total Project Investment:** **₹3,75,000 INR** (Three Lakhs Seventy-Five Thousand Rupees Only)  
> *Offers 63% savings compared to standard enterprise software development rates.*

---

### 4.2 Milestone-Linked Payment Schedule

| Stage | Milestone Description | % Allocation | Amount (INR) |
|---|---|---|---|
| **Stage 1** | **Project Kick-off & SOW Execution** (Architecture & Core UI Setup) | **30%** | ₹1,12,500 |
| **Stage 2** | **Mid-Project Demo** (CAD Floor Map, Multi-Month Calendar, SLA Service Desk) | **30%** | ₹1,12,500 |
| **Stage 3** | **Staging Deployment on Hostinger VPS** (Database, Invoicing, Security Passes) | **25%** | ₹93,750 |
| **Stage 4** | **Final UAT Sign-Off & Production Handover** (Source Code & Admin Transfer) | **15%** | ₹56,250 |
| **TOTAL** | | **100%** | **₹3,75,000** |

---

### 4.3 Third-Party Infrastructure Cost Estimates (Billed Directly to Client)
* **Hostinger Cloud VPS (KVM 2 / KVM 4):** ~₹799 to ₹1,499 / month (Billed directly to client's Hostinger account).
* **Domain Name (e.g. `workafella.io` / `workafella.in`):** ~₹800 to ₹1,200 / year.
* **SSL Certificate:** Free (Let's Encrypt automated SSL).

---

## 5. Assumptions, Dependencies & SLA Warranty

1. **Client Responsibilities:** Provision of corporate logo/branding assets, Hostinger account credentials, and designated single point of contact (SPOC) for milestone sign-offs.
2. **Post-Launch Warranty:** Includes **60 days of complimentary bug fixes, performance monitoring, and technical maintenance** following production Go-Live.
3. **Intellectual Property (IP):** 100% of all source code, design assets, database schemas, and documentation are transferred exclusively to the client upon final milestone settlement.

---

## 6. Document Acceptance & Authorization

By signing below, both parties acknowledge that they have reviewed, accepted, and agreed to all terms, deliverables, and payment milestones specified in this Statement of Work.

**For Workafella Coworking Pvt. Ltd.**  
Name: _______________________________  
Title: ________________________________  
Signature: ___________________________  
Date: ________________________________  

**For Software Development & Architecture Team**  
Name: _______________________________  
Title: Lead Solutions Architect  
Signature: ___________________________  
Date: September 1, 2026  
