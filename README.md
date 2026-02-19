# 📦 BulQ Logistics Platform

![BulQ Banner](https://via.placeholder.com/1200x400?text=BulQ+Logistics+Platform)

> **The smarter way to manage your global shipping.** > A comprehensive logistics management solution connecting users with seamless pickup, drop-off, and international shipping services.

[![Next.js](https://img.shields.io/badge/Frontend-Next.js_14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-green?logo=spring)](https://spring.io/projects/spring-boot)
[![Tailwind CSS](https://img.shields.io/badge/Style-Tailwind_CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Assets-Cloudinary-blue)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Installation](#installation)
- [Usage & Workflows](#-usage--workflows)
  - [Booking a Drop-Off (BADO)](#booking-a-drop-off-bado)
  - [KYC Verification](#kyc-verification)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 About the Project

**BulQ Logistics** is a full-stack application designed to streamline the logistics process for individuals and businesses. Whether it's booking a local pickup, scheduling a drop-off at a designated hub, or managing international shipments, BulQ provides a unified interface for all shipping needs.

The platform bridges the gap between digital booking and physical logistics, offering real-time hub selection, dynamic shipping cost calculation, and rigorous identity verification (KYC) for security.

---

## ✨ Key Features

### 👤 User Management
* **Secure Authentication:** User registration and login with JWT-based security.
* **Profile Management:** Update personal details, default addresses, and profile pictures.
* **Role-Based Access:** Support for Users, Businesses, and Drivers.

### 📦 Logistics Operations
* **Book A Drop Off (BADO):** A multi-step wizard to schedule package drop-offs at verified Hubs.
* **Hub Discovery:** Dynamic searching and filtering of logistics hubs (e.g., Lagos, Calgary) with operational hours and contact details.
* **Package Management:** Detailed cargo specifications (Weight, Dimensions, HS Codes).

### 🛡️ Security & Compliance
* **KYC Verification:** robust identity verification system supporting NIN, Passport, and Driver's Licenses.
* **Document Upload:** Client-side image handling using **Cloudinary** for secure ID and selfie uploads.
* **Status Tracking:** Real-time feedback on verification status (Pending, Approved, Rejected).

---

## 🛠 Tech Stack

### Frontend (Client)
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React, React Icons
* **State Management:** React Hooks (`useState`, `useEffect`, `useContext`)
* **HTTP Client:** Fetch API (Server Actions & Client Components)

### Backend (Server)
* **Framework:** Java Spring Boot
* **Architecture:** RESTful API
* **Database:** PostgreSQL / MySQL (JPA/Hibernate)
* **Documentation:** Swagger / OpenAPI 3.0
* **Messaging:** Apache Kafka (for email notifications)

### Third-Party Services
* **Cloudinary:** Image and Document hosting.
* **Google Maps Platform:** (Optional) Location services.

---

## 🏗 System Architecture

The application follows a decoupled **Client-Server** architecture:

1.  **Client:** The Next.js frontend handles UI rendering, form validation, and direct-to-cloud image uploads.
2.  **API Gateway:** Spring Boot controllers expose REST endpoints (e.g., `/api/v1/hubs/all`, `/api/v1/kyc/submit`).
3.  **Service Layer:** Business logic for booking validation, shipping calculations, and KYC processing.
4.  **Persistence:** Data storage for Users, Bookings, and Hubs.

---

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* Node.js (v18+)
* Java JDK 17+
* Maven or Gradle
* Docker (Optional, for database)

### Environment Configuration

Create a `.env.local` file in the root of the **frontend** directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8091/api/v1

# Cloudinary Configuration (For KYC Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

### Installation

#### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/bulq-logistics.git](https://github.com/your-username/bulq-logistics.git)
cd bulq-logistics

```

#### 2. Frontend Setup

```bash
cd frontend
npm install
# or
yarn install

# Run the development server
npm run dev

```

*Visit `http://localhost:3000` to see the app.*

#### 3. Backend Setup

```bash
cd backend
# Build the project
./mvnw clean install

# Run the Spring Boot application
./mvnw spring-boot:run

```

*The backend API will start on `http://localhost:8091`.*

---

## 📱 Usage & Workflows

### Booking a Drop-Off (BADO)

1. Navigate to the **Dashboard**.
2. Click "Book a Drop Off".
3. **Step 1:** Enter Sender and Receiver details.
4. **Step 2:** Select a Logistics Hub from the dynamic list (filtered by City/State).
5. **Step 3:** Enter package dimensions, value, and schedule a drop-off time.
6. **Submit:** The booking is created, and a reference ID is generated.

### KYC Verification

1. Go to **Settings > Identity Verification**.
2. Fill in personal details (BVN, Bank, Address).
3. Select ID Type (NIN, Passport, Drivers License, Voters Card).
4. **Upload Documents:** Upload Front/Back of ID and a Selfie.
* *Note: Images are uploaded directly to Cloudinary; URLs are sent to the backend.*


5. Submit for review. Approval takes approx. 1 hour.

---

## 📖 API Documentation

The backend exposes a comprehensive Swagger UI for API testing and documentation.

* **Swagger UI:** `http://localhost:8091/swagger-ui.html`
* **OpenAPI Spec:** `http://localhost:8091/v3/api-docs`

**Key Endpoints:**

* `POST /auth/register` - User Registration
* `POST /auth/login` - User Authentication
* `GET /hubs/all` - Fetch all Logistics Hubs
* `POST /booking/drop-off` - Create Drop-off Appointment
* `POST /kyc/submit` - Submit Identity Verification

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
<p>Built with ❤️ by <b>Bulq Co.</b></p>
</div>

```

```
