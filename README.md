# 🅿️ ParkEase Frontend — Smart Parking Management System

![Angular](https://img.shields.io/badge/Angular-17-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

> **ParkEase Frontend** is an Angular 17 Single Page Application (SPA) for the ParkEase Smart Parking Management Platform. It provides role-based dashboards for Drivers, Lot Managers, and Administrators.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Role-Based Access](#role-based-access)
- [Pages & Routes](#pages--routes)
- [API Integration](#api-integration)
- [Environment Configuration](#environment-configuration)

---

## ✨ Features

### 🚗 Driver Features
- Register & Login
- Search parking lots by city
- Book parking spots with vehicle selection
- Pay online (UPI, Card, Cash, Net Banking, Wallet)
- View & cancel bookings
- Download payment receipts
- Manage vehicles (add/delete)
- View notifications
- Edit profile

### 🅿️ Lot Manager Features
- Manage parking lots (add/view)
- Manage parking spots per lot
- View all bookings (confirm/cancel)
- Revenue analytics dashboard

### 👨‍💼 Admin Features
- Manage all users (activate/deactivate/delete)
- Manage parking lots (approve/reject)
- View all platform bookings
- Process/refund payments
- Platform-wide analytics

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Angular | 17 | Frontend Framework |
| TypeScript | 5.x | Language |
| Angular Router | 17 | Client-side Routing |
| Angular Forms | 17 | Form Handling |
| SCSS | — | Styling |

---

## ✅ Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17+
- ParkEase Backend running (localhost:8090)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/imsachinkumar/ParkEase-Frontend.git
cd parkease-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
ng serve
```

---

## 📁 Project Structure

```
parkease-frontend/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── driver/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── search-lots/
│   │   │   │   ├── my-bookings/
│   │   │   │   ├── my-vehicles/
│   │   │   │   ├── payments/
│   │   │   │   ├── notifications/
│   │   │   │   └── profile/
│   │   │   ├── lot-manager/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── my-lots/
│   │   │   │   ├── manage-spots/
│   │   │   │   ├── bookings/
│   │   │   │   └── revenue/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── manage-users/
│   │   │   │   ├── manage-lots/
│   │   │   │   ├── all-bookings/
│   │   │   │   └── payments/
│   │   │   └── landing/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── auth.ts
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.ts
│   ├── assets/
│   └── styles.scss
├── sonar-project.properties
├── angular.json
├── package.json
└── README.md
```

---

## 🔐 Role-Based Access

| Role | Login Redirect | Access |
|------|--------------|--------|
| **DRIVER** | `/driver/dashboard` | Driver pages only |
| **MANAGER** | `/manager/dashboard` | Manager pages only |
| **ADMIN** | `/admin/dashboard` | All pages |

>  Admin registration is disabled — only DRIVER and MANAGER can register.

---

## 🗺️ Pages & Routes

### Public Routes
| Route | Page |
|-------|------|
| `/` | Landing Page |
| `/login` | Login |
| `/register` | Register (Driver/Manager only) |

### Driver Routes
| Route | Page |
|-------|------|
| `/driver/dashboard` | Driver Dashboard |
| `/driver/search` | Find Parking |
| `/driver/bookings` | My Bookings |
| `/driver/vehicles` | My Vehicles |
| `/driver/payments` | Payment History |
| `/driver/notifications` | Notifications |
| `/driver/profile` | Profile |

### Manager Routes
| Route | Page |
|-------|------|
| `/manager/dashboard` | Manager Dashboard |
| `/manager/lots` | My Lots |
| `/manager/spots` | Manage Spots |
| `/manager/bookings` | Bookings |
| `/manager/revenue` | Revenue |

### Admin Routes
| Route | Page |
|-------|------|
| `/admin/dashboard` | Admin Dashboard |
| `/admin/users` | Manage Users |
| `/admin/lots` | Manage Lots |
| `/admin/bookings` | All Bookings |
| `/admin/payments` | Payments |

:

**Developer:** Sachin Kumar  
**GitHub:** [@imsachinkumar](https://github.com/imsachinkumar)

---

*ParkEase — Find. Reserve. Park. Effortlessly.* 🅿️
