# 🍽️ Buzzer - Modern Restaurant Ordering Web App

> A mobile-first, PWA-ready Next.js application for restaurant discovery, ordering, and management. Built with modern React patterns and optimized for both mobile and desktop experiences.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.56.2-FF4154)](https://tanstack.com/query)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Mobile-First Design](#mobile-first-design)
- [Authentication Flow](#authentication-flow)
- [Internationalization](#internationalization)
- [Contributing](#contributing)

## 🎯 Overview

Buzzer is a comprehensive restaurant ordering platform that enables users to discover restaurants, browse menus, place orders, and manage their accounts. The application features a modern, mobile-first design with full desktop responsiveness, making it accessible across all devices.

### Core Capabilities:
- 🔐 **Phone-based Authentication** via Firebase
- 📍 **Geo-Spatial Search** to find nearest restaurants
- 🛒 **Shopping Cart & Order Management**
- ⭐ **Product Reviews & Ratings**
- 👨‍💼 **Admin Dashboard** with full CRUD operations
- 🌍 **Internationalization** (English/Arabic support)
- 📸 **Image Upload** via Cloudinary (Unsigned)

## 🛠️ Tech Stack

### Core Framework
- **Next.js** 16.0.10 - React framework with App Router
- **React** 19.2.1 - UI library
- **TypeScript** 5.6.3 - Type safety

### Styling & UI
- **Tailwind CSS** 4.0 - Utility-first CSS framework
- **Framer Motion** 11.11.1 - Animation library
- **Heroicons** 2.2.0 - Icon library

### State Management & Data Fetching
- **TanStack Query** 5.56.2 - Server state management
- **React Context API** - Client state management

### Forms & Validation
- **React Hook Form** 7.53.0 - Form management
- **Zod** 3.23.8 - Schema validation
- **@hookform/resolvers** 3.9.0 - Form validation integration

### Authentication & Services
- **Firebase** 10.13.2 - Authentication (Phone Auth)
- **Axios** 1.7.7 - HTTP client
- **Cloudinary** - Image upload and storage

### Internationalization
- **next-intl** 4.6.1 - i18n framework

### Developer Experience
- **ESLint** 9 - Code linting
- **React Hot Toast** 2.4.1 - Toast notifications

## ✨ Key Features

### 📱 Mobile-First Design & Responsive Desktop Layout
- Optimized for mobile devices with touch-friendly UI
- Seamless desktop experience with responsive breakpoints
- Progressive Web App (PWA) ready architecture

### 🔐 Phone Authentication (Firebase)
- Secure phone number-based authentication
- OTP verification via Firebase Auth
- Automatic token management and refresh

### 📍 Geo-Spatial Search (Find Nearest Suppliers)
- Browser geolocation API integration
- Haversine formula for distance calculation
- Find restaurants within a configurable radius
- Real-time location-based recommendations

### 📊 Admin Dashboard with CRUD Operations
- Complete admin interface for managing:
  - Restaurants
  - Products & Categories
  - Orders & Users
  - Dashboard statistics
- Protected routes with role-based access control

### ☁️ Image Upload (Cloudinary Unsigned)
- Direct client-side uploads to Cloudinary
- Upload progress tracking
- Support for multiple image formats
- Optimized image delivery

### 🌍 Multi-Language Support
- English and Arabic language support
- RTL (Right-to-Left) layout support
- Localized content throughout the application

### 🛒 E-Commerce Features
- Shopping cart management
- Order tracking
- Product reviews and ratings
- Search and filtering capabilities

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Firebase Project** with Authentication enabled
  - Phone Authentication must be enabled
  - Configure reCAPTCHA for phone auth
- **Cloudinary Account** for image uploads
  - Create an unsigned upload preset
- **Backend API** running (see [Backend README](../../server/buzzer-backend/README.md))

## 🔐 Environment Variables

Create a `.env.local` file in the root directory (`client/buzzerrestaurant/`) with the following variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | ✅ Yes | `http://localhost:3000/api` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | ✅ Yes | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | ✅ Yes | `your-app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | ✅ Yes | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket | ✅ Yes | `your-app.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | ✅ Yes | `123456789012` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | ✅ Yes | `1:123456789012:web:abc...` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | ✅ Yes | `your-cloud-name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary Upload Preset (Unsigned) | ✅ Yes | `your-upload-preset` |

### Example `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

### How to Get Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Navigate to **Project Settings** → **General**
4. Scroll down to **Your apps** section
5. Copy the configuration values from the Firebase SDK snippet

### How to Get Cloudinary Credentials:

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to **Dashboard** to find your `Cloud Name`
3. Navigate to **Settings** → **Upload** → **Upload presets**
4. Create an **Unsigned** upload preset
5. Copy the preset name to use as `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## 🚀 Getting Started

Follow these steps to set up the frontend application:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Buzzer-Restaurant/client/buzzerrestaurant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

1. Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local  # If you have an example file
```

2. Fill in all required environment variables (see [Environment Variables](#environment-variables) section above).

### 4. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3001` (or the next available port).

Open [http://localhost:3001](http://localhost:3001) in your browser to see the application.

### 5. Verify Backend Connection

Ensure your backend API is running on `http://localhost:3000` (or update `NEXT_PUBLIC_API_URL` accordingly).

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server with hot reload |
| `npm run build` | Creates an optimized production build |
| `npm run start` | Starts the production server (requires `npm run build` first) |
| `npm run lint` | Runs ESLint to check for code quality issues |

### Development

```bash
npm run dev
```

Starts the Next.js development server. The app will be available at `http://localhost:3001` with:
- Hot Module Replacement (HMR)
- Fast Refresh for React components
- Error overlay for debugging

### Production Build

```bash
npm run build
```

Creates an optimized production build:
- Server-side rendering optimization
- Code splitting and tree shaking
- Image optimization
- Static page generation

### Production Server

```bash
npm start
```

Starts the production server (must run `npm run build` first).

### Linting

```bash
npm run lint
```

Runs ESLint to identify and fix code quality issues.

## 📁 Project Structure

The project follows Next.js 16 App Router conventions with route groups for organization:

```
client/buzzerrestaurant/
├── app/
│   ├── (auth)/                    # Authentication route group
│   │   ├── layout.tsx             # Auth layout (no nav/footer)
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── register/
│   │   │   └── page.tsx           # Registration page
│   │   └── verify-otp/
│   │       └── page.jsx           # OTP verification
│   │
│   ├── (shop)/                    # Customer-facing routes
│   │   ├── layout.tsx             # Shop layout (with nav/footer)
│   │   ├── page.tsx               # Home page
│   │   ├── products/              # Product pages
│   │   ├── restaurants/           # Restaurant listing
│   │   ├── cart/                  # Shopping cart
│   │   ├── checkout/              # Checkout page
│   │   ├── orders/                # Order management
│   │   ├── profile/               # User profile
│   │   └── ...                    # Other shop pages
│   │
│   ├── dashboard/                 # Admin dashboard (no route group)
│   │   ├── layout.tsx             # Dashboard layout
│   │   ├── page.tsx               # Dashboard home
│   │   ├── products/              # Product management
│   │   ├── restaurants/           # Restaurant management
│   │   ├── categories/            # Category management
│   │   ├── orders/                # Order management
│   │   └── users/                 # User management
│   │
│   ├── components/                # Reusable components
│   │   ├── admin/                 # Admin-specific components
│   │   ├── auth/                  # Authentication components
│   │   ├── home/                  # Home page sections
│   │   ├── layout/                # Layout components (Nav, Footer, etc.)
│   │   ├── shop/                  # Shop components
│   │   └── ui/                    # Base UI components
│   │
│   ├── context/                   # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── CartContext.tsx        # Shopping cart state
│   │   ├── OrderContext.tsx       # Order state
│   │   └── ...                    # Other contexts
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useGeoLocation.ts      # Browser geolocation
│   │   ├── useCloudinaryUpload.ts # Image upload
│   │   └── ...                    # Other hooks
│   │
│   ├── lib/                       # Utility libraries
│   │   ├── axios.ts               # API client configuration
│   │   ├── firebase.ts            # Firebase configuration
│   │   └── ...                    # Other utilities
│   │
│   ├── providers/                 # Global providers
│   │   ├── AppProviders.tsx       # Main provider wrapper
│   │   └── IntlProvider.tsx       # Internationalization provider
│   │
│   ├── types/                     # TypeScript type definitions
│   │   ├── index.ts               # Main types
│   │   ├── product.ts             # Product types
│   │   └── ...                    # Other types
│   │
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Root page
│   └── globals.css                # Global styles
│
├── messages/                      # i18n translation files
│   ├── en.json                    # English translations
│   └── ar.json                    # Arabic translations
│
├── public/                        # Static assets
├── .env.local                     # Environment variables (not in git)
├── next.config.mjs                # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json                   # Dependencies and scripts
```

### Key Directories Explained:

- **`app/(auth)`**: Authentication-related pages (login, register, OTP verification). These pages use a minimal layout without navigation.

- **`app/(shop)`**: Main customer-facing pages (home, products, restaurants, cart, orders, profile). These pages share a common layout with navigation and footer.

- **`app/dashboard`**: Admin-only pages for managing the platform. Protected by authentication and role-based access.

- **`app/components`**: Reusable React components organized by feature/domain.

- **`app/context`**: React Context providers for global state management (Auth, Cart, Orders, etc.).

- **`app/providers`**: Higher-level provider components that wrap the application (TanStack Query, Auth, i18n).

- **`app/hooks`**: Custom React hooks for reusable logic (geolocation, image upload, data fetching).

- **`app/lib`**: Utility functions and library configurations (Axios, Firebase, etc.).

## 📱 Mobile-First Design

The application follows a **mobile-first** approach:

- **Base styles** target mobile devices (small screens)
- **Responsive breakpoints** enhance the experience on larger screens:
  - `md:` - Medium devices (tablets)
  - `lg:` - Large devices (desktops)
  - `xl:` - Extra large devices

### Example:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half width, Desktop: third width */}
</div>
```

### Layout Behavior:
- **Mobile**: Bottom navigation bar, hamburger menu, single-column layouts
- **Desktop**: Sidebar navigation, top header, multi-column grids

## 🔐 Authentication Flow

The application uses Firebase Phone Authentication:

1. **User enters phone number** on login/register page
2. **Firebase sends OTP** via SMS
3. **User enters OTP** to verify
4. **Firebase returns ID token** upon successful verification
5. **Backend verifies token** and creates/authenticates user
6. **Token stored** in Firebase Auth state (managed automatically)
7. **Axios interceptor** adds token to all API requests

### Protected Routes:
- Routes in `app/dashboard` require admin authentication
- User-specific pages check authentication status
- Unauthenticated users are redirected to login

## 🌍 Internationalization

The app supports multiple languages using `next-intl`:

- **English** (en) - Default language
- **Arabic** (ar) - Right-to-Left (RTL) support

### Adding Translations:
1. Edit `messages/en.json` for English
2. Edit `messages/ar.json` for Arabic
3. Use `useTranslations()` hook in components:
```tsx
const t = useTranslations('common');
return <h1>{t('welcome')}</h1>;
```

## 🐛 Troubleshooting

### Common Issues

**Environment Variables Not Working:**
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart the dev server after changing `.env.local`
- Verify file is named `.env.local` (not `.env`)

**Firebase Authentication Not Working:**
- Verify all Firebase environment variables are set correctly
- Check Firebase Console → Authentication → Sign-in method → Phone is enabled
- Ensure reCAPTCHA is configured for phone auth

**Backend Connection Errors:**
- Verify backend is running on the correct port
- Check `NEXT_PUBLIC_API_URL` matches your backend URL
- Ensure CORS is properly configured on the backend

**Cloudinary Upload Fails:**
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is correct
- Check upload preset is set to "Unsigned"
- Ensure preset allows the file formats you're uploading

**TypeScript Errors:**
- Run `npm install` to ensure all types are installed
- Check `tsconfig.json` configuration
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines:
- Use TypeScript for all new files
- Follow the existing component structure
- Use mobile-first Tailwind classes
- Add translations for any user-facing text
- Write descriptive commit messages

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Buzzer Restaurant Team**

---

**Built with ❤️ using Next.js 16 and React 19**

For questions or issues, please open an issue on GitHub.
