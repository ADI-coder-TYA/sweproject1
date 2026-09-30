# The Grand Horizon — 5-Star Hotel Automation System
### Academic Software Engineering Project (100% Free Resources)

---

## 1. Overview & UML Specification Alignment

This software automates the core operational activities of a luxury 5-star hotel in strict conformance with the provided UML diagrams:

| UML Diagram | System Implementation |
|:---|:---|
| **Sequence Diagram 1** (Room Reservation & Allocation) | Advance & On-spot bookings; input of arrival time, duration, advance paid, bed/AC type; automated room allocation; unique token generation; **Apology Message Modal** if no suitable room is available. |
| **Sequence Diagram 2** (Catering Charges & Occupancy Tariff) | Food consumption logger by unique token number, food item, quantity, date/time; Monthly Average Occupancy Rate calculator; **Percentage-based Tariff Revision Engine** ($+\%$ or $-\%$). |
| **Sequence Diagram 3** (Checkout, Final Bill & Discounts) | Token lookup; aggregation of room charges, stay duration, catering consumptions, and advance paid; **Frequent Guest ID verification & discount deduction**; printable 5-star tax folio. |
| **State Machine / Statechart** | Full lifecycle: `Reservation` $\rightarrow$ `AvailabilityCheck` $\rightarrow$ [`ReservationFailed` \| `RoomAllocated`] $\rightarrow$ `CheckedIn` $\rightarrow$ `Staying` $\leftrightarrow$ `FoodService` $\rightarrow$ `Checkout` $\rightarrow$ `BillGeneration` $\rightarrow$ [`DiscountApplied` \| `PaymentDue`] $\rightarrow$ `CheckedOut` $\rightarrow$ `RoomAvailable`. |
| **Use Case Diagram** | Actors: **Guest**, **Receptionist**, **Catering Manager**, **Hotel Manager**, and **System Payment Gateway**. |
| **Activity Diagram** | Parallel management tracks: Manager occupancy review & tariff adjustment; Guest stay, catering loop, discount application, and advance deduction. |
| **Class Diagram** | Exact classes, properties, and methods: `Hotel`, `Room`, `Guest`, `Reservation`, `Token`, `Bill`, `FoodItem`, `FoodConsumption`, `Tariff`, and `Occupancy`. |

---

## 2. Technology Stack (100% Free & Zero-Config)

- **Frontend:** React 19 + Vite with Vanilla CSS (Rich 5-Star Hotel luxury aesthetic: Deep Navy `#060A14`, Champagne Gold `#C5A059`, Glassmorphism, and responsive printable invoice stylesheets).
- **Backend:** Node.js + Express.js REST API implementing all domain services and sequence diagram contracts.
- **Database:** SQLite relational database via `better-sqlite3` (Zero-cost, relational integrity, foreign keys, and WAL mode).
- **Icons:** `lucide-react` for luxury UI indicators.
- **Deployment:** 100% Free Tier on **Render.com** (Free Web Service) or **Vercel** / **Netlify**.

---

## 3. Quickstart & Local Execution

### Prerequisites
- Node.js (v18+) and npm installed.

### Run in 1 Step (Unified Production Server):
```bash
# From project root:
npm start
```
Open **[http://localhost:5000](http://localhost:5000)** in any browser.

### Development Mode (with Hot Reloading):
```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Frontend with Vite HMR
npm run dev:client
```
Frontend runs on `http://localhost:3000` (auto-proxies `/api` to port 5000).

### Re-seed Database to Default 5-Star Hotel State:
```bash
npm run seed
```

### Run Automated E2E Test Suite:
```bash
node server/test-all-flows.js
```

---

## 4. 100% Free Cloud Deployment Guide

### Option A: Free Single-Service on Render.com (Recommended)
1. Push this repository to a free GitHub or GitLab account.
2. Sign up for free at [Render.com](https://render.com) (no credit card required).
3. Click **New +** $\rightarrow$ **Web Service**.
4. Connect your repository.
5. Set:
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
6. Click **Deploy Web Service**. Render provides a free `https://your-app.onrender.com` URL.

### Option B: Decoupled Deploy (Vercel + Render)
- **Frontend (Vercel):** Connect `client/` folder to [Vercel.com](https://vercel.com) (Free tier). Set root directory to `client`.
- **Backend (Render):** Deploy `server/` to Render.com free web service.

---

## 5. Walkthrough of Application Features

### 1. Reception Desk & Room Allocation (`#tab-receptionist`)
- **New Guest Registration:**
  - Choose **On-Spot** or **Advance** booking.
  - Fill Guest Name, Phone, Arrival Date/Time, Duration (Nights), Bed Type (Single/Double), AC Type (AC/Non-AC), and Advance Paid.
  - Optional Frequent Guest ID (e.g. `VIP-777`, `VIP-888`, `VIP-999`, `GOLD-101`) with instant verification.
  - Click **Check Availability & Allot Room**.
  - **Success:** Automatically allocates room number and generates a unique token (e.g., `TKN-8421`).
  - **Apology Modal:** If all rooms in that category are booked, the system automatically triggers a formal apology message dialog and presents alternative available rooms.
- **Departure & Settlement:**
  - Enter a token or select any in-house guest to preview the bill.
  - Click **Finalize Checkout & Print Bill** to open the luxury folio and release the room.

### 2. Catering Services (`#tab-catering`)
- Select an active guest stay token.
- Choose a gourmet item from the catalog (Continental Breakfast, Filet Mignon, Sparkling Wine, Desserts, etc.).
- Set quantity, date, and time.
- Click **Record Consumption Against Token** to update the guest's folio ledger.

### 3. Hotel Manager & Tariff Strategy (`#tab-manager`)
- **Monthly Occupancy Rate:** Select any month and year to view occupied rooms, total capacity (24 rooms), and average occupancy percentage.
- **Dynamic Tariff Revision:** Input any percentage ($+15\%$ peak season surge or $-10\%$ off-season discount), preview updated rates, and execute the revision across all or specific room categories.

### 4. Bills Ledger & Loyalty Registry (`#tab-invoices`)
- View audit records of all settled checkouts.
- Re-open and print any historical invoice folio.
- Browse the Frequent Guest VIP registry.
