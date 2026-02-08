# 💰 Tournest - Tour Management System

A modern, high-performance web application for EdenSuite, a comprehensive platform for property rentals, tour bookings, and host management. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## 🌐 Live URL

- **Frontend:** [https://eden-suite-client.vercel.app/](https://eden-suite-client.vercel.app/)
- **Backend API:** [https://eden-suite-server.vercel.app/](https://eden-suite-server.vercel.app/)

---

## 🎯 Overview

EdenSuite Client is a feature-rich property management and tour booking platform. It provides a seamless experience for Users to book stays/tours, Hosts to manage properties, and Admins to oversee the entire ecosystem with advanced analytics and moderation tools.

### Key Highlights

- ✅ **Modern Architecture** - Built with Next.js 15 (App Router) and React 19
- ✅ **Role-Based Access** - Specialized dashboards for User, Host, and Admin
- ✅ **Dynamic Booking** - Real-time tour and property booking system
- ✅ **Financial Management** - Stripe integration for secure payments and payouts
- ✅ **Stunning UI/UX** - Custom design with Tailwind CSS and Framer Motion
- ✅ **Interactive Dashboards** - Rich data visualization with Recharts
- ✅ **Type Safety** - Comprehensive TypeScript coverage
- ✅ **Responsive Design** - Optimized for mobile, tablet, and desktop

---

## 🚀 Features

### 🔐 Authentication

- **Secure Login/Register** - JWT-based authentication with refresh token logic
- **Social Integration** - Ready for advanced auth patterns
- **Role Selection** - Dynamic onboarding for Users and Hosts
- **Profile Security** - Password management and secure session handling

### 👤 User Features

- **Tour Discovery** - Browse and filter wide range of tours and destinations
- **Property Booking** - Book rental properties with real-time availability
- **Reviews & Ratings** - Share experiences on tours and properties
- **Booking History** - Manage and track all past and upcoming bookings
- **Profile Management** - Personalized user dashboard and profile settings

### 🏠 Host Features

- **Listing Management** - Create and manage property and tour listings
- **Booking Requests** - Overview of incoming guest requests
- **Earnings Dashboard** - Track revenue and manage payouts
- **Communication** - Tools to interact with potential guests
- **Host Analytics** - Insights into listing performance

### 👨‍💼 Admin Features

- **Platform Overview** - Comprehensive dashboard with system-wide stats
- **User Moderation** - Manage accounts for Users, Hosts, and Admins
- **Content Approval** - Review and approve new listings
- **Financial Oversight** - Monitor all transactions and payout requests
- **Blog Management** - Create and manage platform-wide blog content

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework | v16.0.x |
| **React** | UI library | v19.2.x |
| **TypeScript** | Type safety | v5.x |
| **Tailwind CSS** | Styling | v4.x |
| **Framer Motion** | Animations | v12.2.x |
| **Lucide React** | Icon library | v0.559.x |
| **React Hook Form** | Form handling | v7.68.x |
| **Zod** | Schema validation | v4.1.x |
| **Sonner** | Toast notifications | v2.0.x |
| **Recharts** | Data visualization | v3.6.x |
| **Radix UI** | Headless components | Latest |

---

## 📁 Project Structure

```
Eden-Suite-Client/
├── app/                      # Next.js App Router
│   ├── (commonLayout)/       # Public routes (Home, Blogs, Tours)
│   ├── (dashboardLayout)/    # Protected routes
│   │   ├── admin/            # Admin dashboard pages
│   │   ├── host/             # Host dashboard pages
│   │   └── user/             # User dashboard pages
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # Reusable UI components
│   ├── ui/                   # shadcn/ui components
│   └── modules/              # Feature-specific components
├── services/                 # API service layer (RTK Query/Fetch)
├── constants/                # App constants
├── hooks/                    # Custom React hooks
├── lib/                      # Utility libraries
├── types/                    # TypeScript definitions
├── zod/                      # Validation schemas
├── public/                   # Static assets
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm / pnpm / yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Farhad25906/Eden-Suite-Client.git
   cd Eden-Suite-Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local and add your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🎮 Demo Login

For testing purposes, you can use the following credentials (if seeded):

| Role | Email | Password |
|------|-------|----------|
| **Admin** | farhad@tournest.com | 123456 |

---

## 👨‍💻 Author

**Farhad Hossen**
- GitHub: [@Farhad25906](https://github.com/Farhad25906)
- Portfolio: [portfolio-farhad.vercel.app](https://portfolio-farhad.vercel.app/)
- LinkedIn: [Farhad Hossen](https://www.linkedin.com/in/farhad-hossen-in/)
- Email: farhadhossen2590@gmail.com

---

## 📞 Support & Feedback

For support, email <strong>farhadhossen2590@gmail.com</strong>.<br />
We value your feedback! Please fill out our
<a href="https://forms.gle/RSLcQxuhhRV4YSiJ9" target="_blank" rel="noopener noreferrer">
Feedback Form
</a>

