# SalonBook - Client (Frontend Application)

SalonBook is an intuitive, modern, role-based salon appointment booking platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Stripe Checkout**. It enables clients to discover luxury beauty and wellness treatments, schedule appointments with conflict-free slot detection, and securely pay online, while offering administrators a complete dashboard for service management, appointment review, and customer moderation.

---

## 🔗 Project Links

- **Live Website:** [https://salon-book-omega.vercel.app](https://salon-book-omega.vercel.app)
- **Client Repository:** [https://github.com/coderalif/-SalonBook](https://github.com/coderalif/-SalonBook)
- **Server Repository:** [https://github.com/coderalif/-SalonBook-server](https://github.com/coderalif/-SalonBook-server)

---

## 🌟 Key Features

### 👤 Customer Features
- **Public Service Catalog:** Browse active salon services categorized by Haircut & Styling, Hair Coloring, Hair Treatment, Facial, Makeup, Manicure & Pedicure, and Spa & Massage.
- **Search & Filter:** Real-time search by service name, category filtering tabs, and price sorting (low to high, high to low).
- **Appointment Scheduling:** Book appointments on `/services/[id]` with conflict prevention for same-date and same-time slots.
- **Customer Dashboard:**
  - Overview with booking metrics (Total, Pending, Confirmed, Cancelled).
  - My Appointments list with live status indicators.
  - Cancel pending bookings directly.
  - Instant Stripe Checkout integration for confirmed appointments.
  - Profile management with ImgBB avatar upload and phone contact updates.

### 🛡️ Administrator Features
- **Admin Dashboard Console:** Analytics overview covering total customers, active services, appointments, and gross revenue.
- **Manage Services (CRUD):** Add new treatments with ImgBB photo upload, edit prices and duration, toggle active/inactive visibility, and delete services.
- **Manage Appointments:** Review all customer requests, confirm pending appointments, or cancel sessions.
- **User Moderation:** Audit registered customer accounts and toggle instant block/unblock access.
- **Audit-Safe Transactions:** View verified Stripe transaction history with session IDs and payment timestamps.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Payment Gateway:** Stripe Checkout Client
- **Image Hosting:** ImgBB API

---

## ⚙️ Required Environment Variables

Create a `.env.local` file in the root of the `client/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_IMGBB_API_KEY=...
```

*(Refer to `.env.example` for details. Never push secret credentials to GitHub.)*

---

## 💻 Local Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <client-repo-url>
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   ```bash
   cp .env.example .env.local
   # Update NEXT_PUBLIC_API_URL with your local or deployed backend URL
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔐 Demo Credentials for Evaluation

- **Administrator Account:**
  - **Email:** `admin@salonbook.com`
  - **Password:** `Admin@123`
- **Customer Account:**
  - **Email:** `customer@example.com`
  - **Password:** `Customer@123`
