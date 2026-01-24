# Tour Nest - Client

A modern, high-performance travel and tour booking platform built with Next.js and Framer Motion.


## 🌐 Live Links

- **Client:** [https://tour-nest-client.vercel.app/](https://tour-nest-client.vercel.app/)
- **Server:** [https://tournest-server.onrender.com/](https://tournest-server.onrender.com/)

## 📂 Repository Links

- **Client Repository:** [https://github.com/Farhad25906/TourNest-Client](https://github.com/Farhad25906/TourNest-Client)
- **Server Repository:** [https://github.com/Farhad25906/TourNest-Server](https://github.com/Farhad25906/TourNest-Server)


## 🔐 Credentials

Admin: [farhad@ph.com](mailto:farhad@ph.com) / 123456

Host: [farhadhossen2590@gmail.com](mailto:farhadhossen2590@gmail.com) / 123456

Tourist: [farhadhossen9036@gmail.com](mailto:farhadhossen9036@gmail.com) / 123456

## 🚀 TeckStack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: [React](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)


### Deployment

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon (PostgreSQL)

## ✨ Core Features (Core Functionalities)

- **Interactive Tour Discovery**: Advanced filtering and search for global destinations.
- **Unique Design Patterns**: Bento-grid layouts, mouse parallax effects, and animated scroll paths.
- **Booking Management**: Real-time tour availability check and secure booking flow.
- **Dynamic Testimonials**: Sophisticated cascading review system with live traveler chronicles.
- **Blogging System**: Comprehensive travel stories and guide articles.
- **Responsive Dashboard**: Dedicated interfaces for both Tourists and Guides.
- **Payment Integration**: Seamless checkout experience using Stripe.

## 👥 Role Based Features  

### For Users

1. **Registration & Login** - Secure authentication with JWT
2. **Profile Creation** - Add personal info, travel interests, and visited countries
4. **Discover Tours** - Search and filter compatible travel companions
4. **Book Tours** - Book Your Tour 
5. **Reviews & Ratings** - Rate and review fellow travelers after trips

### For Admins

1. **Dashboard Access** - Comprehensive platform overview
2. **User Management** - Monitor and manage platform users
3. **Platform Analytics** - Track user activity and engagement


### For Hots

1. **Create Tours** - On the Free Plan, a host can create up to 4 tours per year.
2. **Write Blogs** - On the Free Plan, a host can publish up to 5 blogs per year.
3. **Subscription Management** - Hosts can upgrade their subscription to unlock higher limits, premium features, and advanced management tools.
4. **Payment management** - Manage Your Tour Payments.
5. **Booking Mangement** - Manage Your All Bookings.

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control (RBAC)
- Secure payment processing

## 📁 File Structure

```text
client/
├── app/                  # Next.js App Router (Layouts & Pages)
├── components/
│   ├── module/           # Feature-specific components (Home, Tour, Booking)
│   └── ui/               # Reusable base UI components (Shadcn)
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and shared logic
├── services/             # API service layers (Axios/Fetch)
└── public/               # Static assets (images, icons)
```

## 🛠️ Installation Process

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TourNest/client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file and add:
   ```env
   NEXT_PUBLIC_BASE_API_URL=http://localhost:5000/api/v1
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the browser**:
   Visit [http://localhost:3000](http://localhost:3000).
