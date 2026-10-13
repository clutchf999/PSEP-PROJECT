# 🍔 Online Food Ordering System (FoodExpress)

> **Software Engineering Laboratory Project (SDLC & SRS Compliant)**  
> **Prepared by:** Adithya Kumaresan  
> **Department:** Information Technology  
> **Version:** 1.0  

---

## 📌 Project Overview

The **Online Food Ordering System** is a full-stack web application designed and implemented following the **Software Requirements Specification (SRS)** and **Software Project Plan (SPP)**. It automates restaurant discovery, menu browsing, cart management, online payment processing, real-time order tracking, post-delivery reviews, restaurant owner inventory/order management, and administrator analytical reporting.

---

## ✨ Features & SRS Compliance Matrix

This prototype implements 100% of the functional requirements defined in Section 3 of the SRS document:

| SRS Requirement | Feature Description | Status |
|---|---|---|
| **FR1: User Registration & Login** | Multi-role authentication (Customer, Restaurant Owner, Admin) with secure password hashing (`bcrypt`) and JWT sessions. | ✅ Complete |
| **FR2: Restaurant & Menu Browsing** | Search by keyword/restaurant name, interactive category filtering (Biryani, Burgers, Pizza, Chinese, etc.), and item details. | ✅ Complete |
| **FR3: Menu Management** | Restaurant owners can add, update, delete menu items, and toggle real-time item availability (*In Stock / Out of Stock*). | ✅ Complete |
| **FR4: Cart & Order Placement** | Dynamic shopping cart with quantity adjustments, auto-tax calculations, delivery fee, address entry, and order summary. | ✅ Complete |
| **FR5: Online Payment** | Secure mock payment gateway supporting UPI (QR / VPA), Credit/Debit Cards, and Net Banking with instant transaction generation. | ✅ Complete |
| **FR6: Real-Time Order Tracking** | Interactive visual 4-stage tracking stepper (`Placed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`). | ✅ Complete |
| **FR7: Ratings & Reviews** | Post-delivery verified rating submission (1 to 5 stars + feedback comment) with dynamic recalculation of restaurant ratings. | ✅ Complete |
| **FR8: Order Management (Owner)** | Dedicated owner portal to view live incoming orders, accept/reject, and advance kitchen/delivery status. | ✅ Complete |
| **FR9: Reports & Analytics (Admin)** | Central administrator dashboard with revenue metrics, top-rated restaurant rankings, sales reports, and one-click CSV export. | ✅ Complete |

---

## 🏗️ System Architecture & Database

### Tech Stack:
- **Backend:** Node.js & Express.js (RESTful API architecture)
- **Frontend:** Vanilla HTML5, Modern CSS3 with Responsive Grid/Flexbox, Vanilla ES6 JavaScript
- **Security:** Bcrypt password hashing, JSON Web Tokens (JWT)
- **Database:**
  - Active prototype: File-persisted atomic store (`data/db.json`) for zero-configuration, immediate local execution.
  - Relational DDL: Complete MySQL schema provided in [`database/schema.sql`](database/schema.sql) matching Section 6 of the SRS.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```
The server will start at **`http://localhost:3000`**. Open this URL in any web browser!

---

## 🔑 Pre-Configured Demo Accounts

For rapid evaluation and testing, you can use the **Top Evaluation Bar** in the application to switch personas with a single click, or use the credentials below:

| Role | Email | Password | Access / Purpose |
|---|---|---|---|
| **Customer** | `adithya@example.com` | `password123` | Browse menus, place orders, simulate payments, track live order, rate food |
| **Restaurant Owner** | `owner@bistro.com` | `password123` | Accept orders, change statuses, manage menu items & stock availability |
| **Administrator** | `admin@foodapp.com` | `password123` | View revenue analytics, inspect user accounts, download CSV sales reports |

---

## 🐙 How to Add This Project to GitHub Using GitHub Desktop

Follow these simple steps to add this project to your GitHub profile using **GitHub Desktop**:

1. **Open GitHub Desktop** on your computer.
2. Click on **`File`** in the top menu and select **`Add Local Repository...`** (or press `Ctrl + O`).
3. Click **`Choose...`** and select this project folder:
   ```
   C:\Users\kkuma\OneDrive\Desktop\PSEP PROJECT
   ```
4. Click **`Add Repository`**.
5. You will see all project files listed under "Changes" or already committed on the `main` branch.
6. Click the blue **`Publish repository`** button at the top toolbar.
7. In the dialog:
   - **Name:** `Online-Food-Ordering-System` (or your preferred repository name)
   - **Description:** `Online Food Ordering System prototype built for Software Engineering Laboratory (SDLC / SRS)`
   - Uncheck *"Keep this code private"* if you want it visible publicly on your GitHub profile.
8. Click **`Publish Repository`**.
9. Your project is now live on your GitHub profile! 🎉

---

## 📂 Project Structure

```
PSEP PROJECT/
├── database/
│   └── schema.sql         # Official MySQL DDL schema (SRS Section 6)
│   └── db.js              # Database service with seed data & persistence
├── public/
│   ├── css/
│   │   └── style.css      # Modern responsive UI styling
│   ├── js/
│   │   └── app.js         # Frontend single-page app controller & API client
│   └── index.html         # Main user interface & modals
├── data/
│   └── db.json            # Persistent data file (auto-generated)
├── server.js              # Express.js REST API server
├── package.json           # Node.js dependencies and scripts
├── .gitignore             # Git ignore configuration
├── PLAN.pdf               # Software Project Plan (SPP) document
├── SRS.pdf                # Software Requirements Specification document
└── README.md              # Project documentation
```

---

## 📜 Academic Integrity & Attribution
Developed as part of the **Software Engineering Laboratory** curriculum adhering to IEEE 830 SRS standards and the Waterfall Software Development Life Cycle.
