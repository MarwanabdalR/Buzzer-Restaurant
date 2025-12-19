# 🍽️ Buzzer App Backend

> A comprehensive RESTful API backend for a restaurant management and food ordering system built with Node.js and Express.

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-blue.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.1-2D3748.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## 🎯 Overview

Buzzer App Backend is a robust RESTful API that powers a restaurant management and food ordering platform. It provides endpoints for user authentication, restaurant management, product catalog, order processing, reviews, and administrative functions. The API uses Firebase for authentication, Prisma as the ORM, and MySQL as the database.

### Key Features:
- 🔐 Firebase-based user authentication
- 🏪 Restaurant management with geolocation support
- 🍕 Product catalog with categories and images
- 🛒 Order processing and management
- ⭐ Product reviews and ratings
- 🔍 Search functionality
- 👨‍💼 Admin dashboard endpoints
- 📸 Cloudinary image upload integration

## 🛠️ Tech Stack

### Core Technologies
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js 5.2.1
- **Database:** MySQL 8.0+
- **ORM:** Prisma 6.19.1

### Key Dependencies
- **Authentication:** Firebase Admin SDK
- **File Upload:** Multer + Cloudinary
- **Validation:** Joi
- **Error Handling:** express-async-handler
- **CORS:** cors

### Development Tools
- **Hot Reload:** Nodemon
- **Database Migrations:** Prisma Migrate

## ✨ Features

- ✅ User registration and authentication via Firebase
- ✅ RESTful API with comprehensive CRUD operations
- ✅ Restaurant management with latitude/longitude coordinates
- ✅ Nearby restaurant search using Haversine formula
- ✅ Product catalog with categories, pricing, and discounts
- ✅ Order management system with status tracking
- ✅ Product reviews and rating system
- ✅ Search functionality across restaurants and products
- ✅ Admin dashboard with statistics
- ✅ Image upload to Cloudinary
- ✅ Request validation with Joi schemas
- ✅ Error handling and async/await support

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **MySQL** 8.0 or higher ([Download](https://dev.mysql.com/downloads/))
- **npm** (comes with Node.js) or **yarn**
- **Firebase Project** with Authentication enabled
- **Cloudinary Account** (for image uploads)

## 🔐 Environment Variables

Create a `.env` file in the root directory (`server/buzzer-backend/`) with the following variables:

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | MySQL database connection string | ✅ Yes | `mysql://user:password@localhost:3306/buzzer_db` |
| `PORT` | Server port number | ❌ No | `3000` (default) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ Yes | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ Yes | `abcdefghijklmnopqrstuvwxyz` |
| `FIREBASE_CREDENTIALS` | Path to Firebase service account JSON | ❌ No* | `./serviceAccountKey.json` |

\* **Note:** You must place your Firebase service account key file (`serviceAccountKey.json`) in the root directory. Download it from your Firebase Console → Project Settings → Service Accounts.

### Example `.env` file:

```env
DATABASE_URL=mysql://root:password@localhost:3306/buzzer_db
PORT=3000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🚀 Installation & Setup

Follow these steps to set up the backend server locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Buzzer-Restaurant/server/buzzer-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Create a `.env` file in the root directory:
```bash
cp .env.example .env  # If you have an example file
```

2. Fill in all required environment variables (see [Environment Variables](#environment-variables) section).

3. Place your Firebase service account key file (`serviceAccountKey.json`) in the root directory.

### 4. Set Up MySQL Database

1. Create a MySQL database:
```sql
CREATE DATABASE buzzer_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update `DATABASE_URL` in your `.env` file with your database credentials.

### 5. Run Database Migrations

Generate Prisma Client and apply database migrations:

```bash
npx prisma migrate dev
```

This command will:
- Create the database schema based on `prisma/schema.prisma`
- Generate the Prisma Client
- Apply all pending migrations

### 6. Seed the Database (Optional)

Seed the database with initial restaurant data:

```bash
npm run seed
```

Or seed restaurants specifically:

```bash
node prisma/seed-restaurants.js
```

### 7. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

You should see:
```
Server is running on port 3000
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Starts the production server using `node src/app.js` |
| `npm run dev` | Starts the development server with hot reload using `nodemon` |
| `npm run seed` | Seeds the database with initial data from `prisma/seed.js` |

### Additional Prisma Commands

| Command | Description |
|---------|-------------|
| `npx prisma migrate dev` | Create a new migration and apply it to the database |
| `npx prisma migrate deploy` | Apply migrations in production |
| `npx prisma generate` | Generate Prisma Client |
| `npx prisma studio` | Open Prisma Studio (database GUI) |
| `npx prisma db pull` | Pull database schema into Prisma schema |
| `npx prisma db push` | Push Prisma schema to database without migrations |

## 📚 API Documentation

For detailed API endpoints, request/response formats, authentication, and examples, please refer to the [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) file.

The API includes endpoints for:
- **Authentication** (`/api/auth`) - User registration, login, profile management
- **Restaurants** (`/api/restaurants`) - Restaurant CRUD operations, nearby search
- **Products** (`/api/products`) - Product catalog management
- **Categories** (`/api/categories`) - Category management
- **Orders** (`/api/orders`) - Order creation and management
- **Reviews** (`/api/reviews`) - Product reviews and ratings
- **Search** (`/api/search`) - Search restaurants and products
- **Admin** (`/api/admin`) - Admin dashboard and user management

## 📁 Project Structure

```
server/buzzer-backend/
├── prisma/
│   ├── migrations/          # Database migration files
│   ├── schema.prisma        # Prisma schema definition
│   ├── seed.js              # Database seed script
│   └── seed-restaurants.js  # Restaurant seed data
├── src/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.js    # Cloudinary upload config
│   │   ├── firebase.js      # Firebase Admin config
│   │   └── prisma.js        # Prisma Client instance
│   ├── controllers/         # Route controllers (business logic)
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── restaurantController.js
│   │   ├── reviewController.js
│   │   └── searchController.js
│   ├── middlewares/         # Express middlewares
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── routes/              # API route definitions
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── searchRoutes.js
│   ├── utils/               # Utility functions
│   │   ├── authValidation.js
│   │   ├── orderValidation.js
│   │   ├── productValidation.js
│   │   ├── restaurantValidation.js
│   │   └── validationSchemas.js
│   └── app.js               # Express app entry point
├── .env                     # Environment variables (not in git)
├── .gitignore
├── package.json
├── prisma.config.ts         # Prisma configuration
├── serviceAccountKey.json   # Firebase service account (not in git)
└── README.md                # This file
```

## 🗄️ Database Schema

The application uses the following main models:

- **User** - User accounts with Firebase authentication
- **Restaurant** - Restaurant information with geolocation
- **Category** - Product categories
- **Product** - Menu items/products
- **Order** - Customer orders
- **OrderItem** - Individual items in an order
- **Review** - Product reviews and ratings

For the complete database schema, see `prisma/schema.prisma`.

## 🔒 Authentication

The API uses Firebase Authentication for user management:

1. Users authenticate on the client side using Firebase Auth
2. The client receives a Firebase ID token
3. This token is sent to the backend in the `Authorization` header: `Bearer <token>`
4. The backend verifies the token using Firebase Admin SDK
5. User information is loaded from the database based on `firebaseUid`

## 🧪 Testing the API

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "mobileNumber": "+201234567890",
    "idToken": "your-firebase-id-token"
  }'
```

**Get all restaurants:**
```bash
curl http://localhost:3000/api/restaurants
```

**Find nearby restaurants:**
```bash
curl -X POST http://localhost:3000/api/restaurants/nearby \
  -H "Content-Type: application/json" \
  -d '{
    "userLat": 30.0444,
    "userLng": 31.2357,
    "radiusKM": 10
  }'
```

### Using Postman or Insomnia

Import the API endpoints from `API_DOCUMENTATION.md` and set up your authentication headers.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**
- Verify MySQL is running: `mysql -u root -p`
- Check `DATABASE_URL` in `.env` is correct
- Ensure the database exists

**Prisma Client Not Generated:**
```bash
npx prisma generate
```

**Firebase Authentication Error:**
- Verify `serviceAccountKey.json` is in the root directory
- Check the service account key is valid and has the correct permissions

**Cloudinary Upload Fails:**
- Verify all Cloudinary environment variables are set
- Check your Cloudinary account is active

**Port Already in Use:**
- Change `PORT` in `.env` or stop the process using port 3000

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Buzzer Restaurant Team**

---

**Happy Coding! 🚀**

For questions or issues, please open an issue on GitHub.

