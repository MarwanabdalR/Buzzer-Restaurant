# Buzzer Restaurant API Documentation

**Base URL:** `http://localhost:3000`

**API Version:** 1.0

## Table of Contents

1. [Authentication](#authentication)
2. [Restaurants](#restaurants)
3. [Products](#products)
4. [Categories](#categories)
5. [Orders](#orders)
6. [Reviews](#reviews)
7. [Search](#search)
8. [Admin](#admin)

---

## Authentication

All authenticated endpoints require a Firebase ID token in the `Authorization` header:
```
Authorization: Bearer <firebase-id-token>
```

---

### Register New User

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account after verifying the Firebase ID token.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "mobileNumber": "+201234567890",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

**Query Parameters:** None

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "uuid-string",
    "fullName": "John Doe",
    "mobileNumber": "+201234567890",
    "email": null,
    "image": null,
    "type": "user",
    "firebaseUid": "firebase-uid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "Full name must be at least 3 characters long",
    "Mobile number must be in international format"
  ]
}
```

**Error Response (401 - Invalid Token):**
```json
{
  "success": false,
  "message": "ID token has expired. Please sign in again."
}
```

**Error Response (409 - User Exists):**
```json
{
  "success": false,
  "message": "User already exists, please login"
}
```

---

### Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates an existing user using Firebase ID token.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
}
```

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "uuid-string",
    "fullName": "John Doe",
    "mobileNumber": "+201234567890",
    "email": "john@example.com",
    "image": "https://example.com/image.jpg",
    "type": "user",
    "firebaseUid": "firebase-uid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401 - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid or expired ID token. Please sign in again."
}
```

**Error Response (404 - User Not Found):**
```json
{
  "success": false,
  "message": "User not found. Please register."
}
```

---

### Get User Profile

**Endpoint:** `GET /api/auth/profile`

**Description:** Retrieves the authenticated user's profile information.

**Auth Required:** Yes (authenticateAndLoadUser)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid-string",
    "fullName": "John Doe",
    "mobileNumber": "+201234567890",
    "email": "john@example.com",
    "image": "https://example.com/image.jpg",
    "type": "user",
    "firebaseUid": "firebase-uid"
  }
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "success": false,
  "message": "Unauthorized. Please provide a valid authentication token."
}
```

**Error Response (404 - User Not Found):**
```json
{
  "success": false,
  "message": "User not found. Please register first."
}
```

---

### Update User Profile

**Endpoint:** `PATCH /api/auth/profile`

**Description:** Updates the authenticated user's profile information.

**Auth Required:** Yes

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "image": "https://example.com/new-image.jpg",
  "mobileNumber": "+201234567891"
}
```

**Note:** All fields are optional. At least one field must be provided.

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid-string",
    "fullName": "Jane Doe",
    "mobileNumber": "+201234567891",
    "email": "jane@example.com",
    "image": "https://example.com/new-image.jpg",
    "type": "user",
    "firebaseUid": "firebase-uid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "Full name must be at least 3 characters long"
  ]
}
```

**Error Response (403 - Cannot Change Type):**
```json
{
  "success": false,
  "message": "You cannot change your user type. Please contact an administrator."
}
```

**Error Response (409 - Mobile Number/Email Already in Use):**
```json
{
  "success": false,
  "message": "Mobile number already in use by another account"
}
```

---

## Restaurants

### Get All Restaurants

**Endpoint:** `GET /api/restaurants`

**Description:** Retrieves all restaurants ordered by creation date (newest first).

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurants retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "name": "Pizza Palace",
      "type": "Italian",
      "location": "Cairo, Egypt",
      "latitude": 30.0444,
      "longitude": 31.2357,
      "rating": 4.5,
      "imageUrl": "https://example.com/restaurant.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Restaurant by ID

**Endpoint:** `GET /api/restaurants/:id`

**Description:** Retrieves a single restaurant by its ID.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**URL Parameters:**
- `id` (string, required): Restaurant UUID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant retrieved successfully",
  "data": {
    "id": "uuid-string",
    "name": "Pizza Palace",
    "type": "Italian",
    "location": "Cairo, Egypt",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "rating": 4.5,
    "imageUrl": "https://example.com/restaurant.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

### Find Nearby Restaurants

**Endpoint:** `POST /api/restaurants/nearby`

**Description:** Finds restaurants within a specified radius (in kilometers) from the user's location using the Haversine formula.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userLat": 30.0444,
  "userLng": 31.2357,
  "radiusKM": 10
}
```

**Field Descriptions:**
- `userLat` (number, required): User's latitude (-90 to 90)
- `userLng` (number, required): User's longitude (-180 to 180)
- `radiusKM` (number, optional): Search radius in kilometers (default: 10)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Nearby restaurants retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "name": "Pizza Palace",
      "type": "Italian",
      "location": "Cairo, Egypt",
      "latitude": 30.0444,
      "longitude": 31.2357,
      "rating": 4.5,
      "imageUrl": "https://example.com/restaurant.jpg",
      "distance": 2.5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "userLat and userLng are required and must be numbers"
}
```

**Error Response (500 - Server Error):**
```json
{
  "success": false,
  "message": "Error fetching nearby restaurants",
  "error": "Database query failed"
}
```

---

### Create Restaurant

**Endpoint:** `POST /api/restaurants`

**Description:** Creates a new restaurant. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Pizza Palace",
  "type": "Italian",
  "location": "Cairo, Egypt",
  "rating": 4.5,
  "imageUrl": "https://example.com/restaurant.jpg",
  "latitude": 30.0444,
  "longitude": 31.2357
}
```

**Field Descriptions:**
- `name` (string, required): Restaurant name (1-200 characters)
- `type` (string, required): Restaurant type/category (1-100 characters)
- `location` (string, required): Restaurant location (1-500 characters)
- `rating` (number, optional): Rating from 0-5 (default: 0)
- `imageUrl` (string, optional): Restaurant image URL
- `latitude` (number, optional): Latitude (-90 to 90)
- `longitude` (number, optional): Longitude (-180 to 180)

**Query Parameters:** None

**Success Response (201):**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "id": "uuid-string",
    "name": "Pizza Palace",
    "type": "Italian",
    "location": "Cairo, Egypt",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "rating": 4.5,
    "imageUrl": "https://example.com/restaurant.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "Restaurant name is required",
    "Rating must be between 0 and 5"
  ]
}
```

**Error Response (403 - Admin Only):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

### Update Restaurant

**Endpoint:** `PATCH /api/restaurants/:id`

**Description:** Updates an existing restaurant. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Pizza Palace Updated",
  "rating": 4.8,
  "imageUrl": "https://example.com/new-image.jpg"
}
```

**Note:** All fields are optional. At least one field must be provided.

**URL Parameters:**
- `id` (string, required): Restaurant UUID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant updated successfully",
  "data": {
    "id": "uuid-string",
    "name": "Pizza Palace Updated",
    "type": "Italian",
    "location": "Cairo, Egypt",
    "latitude": 30.0444,
    "longitude": 31.2357,
    "rating": 4.8,
    "imageUrl": "https://example.com/new-image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

### Delete Restaurant

**Endpoint:** `DELETE /api/restaurants/:id`

**Description:** Deletes a restaurant. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (string, required): Restaurant UUID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

## Products

### Get All Products

**Endpoint:** `GET /api/products`

**Description:** Retrieves all products with optional filtering by category or restaurant.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:**
- `categoryId` (number, optional): Filter by category ID
- `restaurantId` (string, optional): Filter by restaurant UUID

**Example Request:**
```
GET /api/products?categoryId=1&restaurantId=uuid-string
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Margherita Pizza",
    "description": "Classic Italian pizza",
    "price": 150.00,
    "originalPrice": 180.00,
    "discountPercent": 17,
    "image": "https://example.com/pizza.jpg",
    "images": ["https://example.com/pizza.jpg"],
    "rate": 4.5,
    "isFeatured": true,
    "categoryId": 1,
    "restaurantId": "uuid-string",
    "category": {
      "id": 1,
      "name": "Pizza",
      "image": "https://example.com/category.jpg"
    },
    "restaurant": {
      "id": "uuid-string",
      "name": "Pizza Palace",
      "type": "Italian",
      "location": "Cairo, Egypt"
    },
    "reviews": []
  }
]
```

**Error Response (400 - Invalid categoryId):**
```json
{
  "message": "Invalid categoryId"
}
```

---

### Get Product by ID

**Endpoint:** `GET /api/products/:id`

**Description:** Retrieves a single product by its ID with full details including reviews.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Product ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza with tomato and mozzarella",
  "price": 150.00,
  "originalPrice": 180.00,
  "discountPercent": 17,
  "image": "https://example.com/pizza.jpg",
  "images": ["https://example.com/pizza.jpg"],
  "rate": 4.5,
  "isFeatured": true,
  "categoryId": 1,
  "restaurantId": "uuid-string",
  "category": {
    "id": 1,
    "name": "Pizza",
    "image": "https://example.com/category.jpg"
  },
  "restaurant": {
    "id": "uuid-string",
    "name": "Pizza Palace",
    "type": "Italian",
    "location": "Cairo, Egypt"
  },
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent pizza!",
      "userId": "uuid-string",
      "productId": 1,
      "user": {
        "id": "uuid-string",
        "fullName": "John Doe",
        "image": "https://example.com/user.jpg"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Product not found"
}
```

---

### Create Product

**Endpoint:** `POST /api/products`

**Description:** Creates a new product. Supports file upload or image URL. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Margherita Pizza
description: Classic Italian pizza
price: 150.00
originalPrice: 180.00
discountPercent: 17
image: [file upload or URL]
images: ["https://example.com/pizza1.jpg", "https://example.com/pizza2.jpg"]
rate: 4.5
isFeatured: true
categoryId: 1
restaurantId: uuid-string
```

**Alternative (JSON with image URL):**
```json
{
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "price": 150.00,
  "originalPrice": 180.00,
  "discountPercent": 17,
  "image": "https://example.com/pizza.jpg",
  "images": ["https://example.com/pizza.jpg"],
  "rate": 4.5,
  "isFeatured": true,
  "categoryId": 1,
  "restaurantId": "uuid-string"
}
```

**Field Descriptions:**
- `name` (string, required): Product name
- `description` (string, optional): Product description
- `price` (number, required): Product price (positive number, 2 decimal places)
- `originalPrice` (number, optional): Original price before discount
- `discountPercent` (number, optional): Discount percentage (0-100). Auto-calculated if originalPrice and price are provided.
- `image` (file/string, optional): Main product image (file upload or URL)
- `images` (array/string, optional): Additional product images (array of URLs or JSON string)
- `rate` (number, optional): Product rating (0-5)
- `isFeatured` (boolean, optional): Whether product is featured (default: false)
- `categoryId` (number, required): Category ID
- `restaurantId` (string, optional): Restaurant UUID

**Query Parameters:** None

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Margherita Pizza",
  "description": "Classic Italian pizza",
  "price": 150.00,
  "originalPrice": 180.00,
  "discountPercent": 17,
  "image": "https://cloudinary.com/pizza.jpg",
  "images": "[\"https://cloudinary.com/pizza.jpg\"]",
  "rate": 4.5,
  "isFeatured": true,
  "categoryId": 1,
  "restaurantId": "uuid-string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400 - Validation Error):**
```json
{
  "message": "Validation error",
  "details": [
    "name is required",
    "price must be a positive number"
  ]
}
```

**Error Response (404 - Category Not Found):**
```json
{
  "message": "Category not found"
}
```

---

### Update Product

**Endpoint:** `PUT /api/products/:id`

**Description:** Updates an existing product. Supports file upload or image URL. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Margherita Pizza Updated
price: 160.00
image: [file upload or URL]
```

**Alternative (JSON):**
```json
{
  "name": "Margherita Pizza Updated",
  "price": 160.00,
  "image": "https://example.com/new-pizza.jpg"
}
```

**Note:** All fields are optional. At least one field must be provided.

**URL Parameters:**
- `id` (number, required): Product ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Margherita Pizza Updated",
  "description": "Classic Italian pizza",
  "price": 160.00,
  "originalPrice": 180.00,
  "discountPercent": 11,
  "image": "https://cloudinary.com/new-pizza.jpg",
  "images": "[\"https://cloudinary.com/new-pizza.jpg\"]",
  "rate": 4.5,
  "isFeatured": true,
  "categoryId": 1,
  "restaurantId": "uuid-string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-02T00:00:00.000Z"
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Product not found"
}
```

---

### Delete Product

**Endpoint:** `DELETE /api/products/:id`

**Description:** Deletes a product. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Product ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "message": "Product deleted"
}
```

**Error Response (400 - Cannot Delete):**
```json
{
  "message": "Cannot delete product because it is referenced by other records (e.g., order items)."
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Product not found"
}
```

---

## Categories

### Get All Categories

**Endpoint:** `GET /api/categories`

**Description:** Retrieves all categories ordered by ID.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Pizza",
    "image": "https://example.com/pizza.jpg"
  },
  {
    "id": 2,
    "name": "Burgers",
    "image": "https://example.com/burgers.jpg"
  }
]
```

---

### Get Category by ID

**Endpoint:** `GET /api/categories/:id`

**Description:** Retrieves a single category by its ID.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Category ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Pizza",
  "image": "https://example.com/pizza.jpg"
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Category not found"
}
```

---

### Create Category

**Endpoint:** `POST /api/categories`

**Description:** Creates a new category. Supports file upload or image URL. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Pizza
image: [file upload or URL]
```

**Alternative (JSON):**
```json
{
  "name": "Pizza",
  "image": "https://example.com/pizza.jpg"
}
```

**Field Descriptions:**
- `name` (string, required): Category name
- `image` (file/string, optional): Category image (file upload or URL)

**Query Parameters:** None

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Pizza",
  "image": "https://cloudinary.com/pizza.jpg"
}
```

**Error Response (400 - Validation Error):**
```json
{
  "message": "Validation error",
  "details": [
    "name is required"
  ]
}
```

---

### Update Category

**Endpoint:** `PUT /api/categories/:id`

**Description:** Updates an existing category. Supports file upload or image URL. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: Pizza Updated
image: [file upload or URL]
```

**Alternative (JSON):**
```json
{
  "name": "Pizza Updated",
  "image": "https://example.com/new-pizza.jpg"
}
```

**URL Parameters:**
- `id` (number, required): Category ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Pizza Updated",
  "image": "https://cloudinary.com/new-pizza.jpg"
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Category not found"
}
```

---

### Delete Category

**Endpoint:** `DELETE /api/categories/:id`

**Description:** Deletes a category. Cannot delete if it has associated products. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Category ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "message": "Category deleted"
}
```

**Error Response (400 - Cannot Delete):**
```json
{
  "message": "Cannot delete category with existing products. Remove or reassign products first."
}
```

**Error Response (404 - Not Found):**
```json
{
  "message": "Category not found"
}
```

---

## Orders

### Create Order

**Endpoint:** `POST /api/orders`

**Description:** Creates a new order for the authenticated user.

**Auth Required:** Yes

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ],
  "location": "123 Main St, Cairo, Egypt"
}
```

**Field Descriptions:**
- `items` (array, required): Array of order items (minimum 1 item)
  - `productId` (number/string, required): Product ID (numeric string accepted)
  - `quantity` (number, required): Quantity (minimum 1)
- `location` (string, optional): Delivery location (max 500 characters)

**Query Parameters:** None

**Success Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "userId": "uuid-string",
    "totalPrice": 460.00,
    "status": "PENDING",
    "location": "123 Main St, Cairo, Egypt",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": 150.00,
        "product": {
          "id": 1,
          "name": "Margherita Pizza",
          "image": "https://example.com/pizza.jpg",
          "price": 150.00
        }
      },
      {
        "id": 2,
        "orderId": 1,
        "productId": 3,
        "quantity": 1,
        "price": 160.00,
        "product": {
          "id": 3,
          "name": "Pepperoni Pizza",
          "image": "https://example.com/pepperoni.jpg",
          "price": 160.00
        }
      }
    ]
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "items array is required",
    "At least one item is required"
  ]
}
```

**Error Response (400 - Product Not Found):**
```json
{
  "success": false,
  "message": "One or more products not found"
}
```

---

### Get My Orders

**Endpoint:** `GET /api/orders`

**Description:** Retrieves all orders for the authenticated user, ordered by creation date (newest first).

**Auth Required:** Yes

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": "uuid-string",
      "totalPrice": 460.00,
      "status": "PENDING",
      "location": "123 Main St, Cairo, Egypt",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "orderId": 1,
          "productId": 1,
          "quantity": 2,
          "price": 150.00,
          "product": {
            "id": 1,
            "name": "Margherita Pizza",
            "image": "https://example.com/pizza.jpg",
            "price": 150.00,
            "rate": 4.5,
            "restaurant": {
              "id": "uuid-string",
              "name": "Pizza Palace",
              "type": "Italian",
              "imageUrl": "https://example.com/restaurant.jpg"
            }
          }
        }
      ]
    }
  ],
  "count": 1
}
```

---

### Get Order by ID

**Endpoint:** `GET /api/orders/:id`

**Description:** Retrieves a single order by its ID. Users can only access their own orders unless they are admins.

**Auth Required:** Yes

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Order ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "id": 1,
    "userId": "uuid-string",
    "totalPrice": 460.00,
    "status": "PENDING",
    "location": "123 Main St, Cairo, Egypt",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": 150.00,
        "product": {
          "id": 1,
          "name": "Margherita Pizza",
          "image": "https://example.com/pizza.jpg",
          "price": 150.00,
          "rate": 4.5
        }
      }
    ],
    "user": {
      "id": "uuid-string",
      "fullName": "John Doe",
      "mobileNumber": "+201234567890"
    }
  }
}
```

**Error Response (403 - Access Denied):**
```json
{
  "success": false,
  "message": "Access denied"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

### Get All Orders (Admin)

**Endpoint:** `GET /api/orders/all`

**Description:** Retrieves all orders in the system. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:**
- `status` (string, optional): Filter by order status (PENDING, COMPLETED, CANCELLED)

**Example Request:**
```
GET /api/orders/all?status=PENDING
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "All orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": "uuid-string",
      "totalPrice": 460.00,
      "status": "PENDING",
      "location": "123 Main St, Cairo, Egypt",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "items": [
        {
          "id": 1,
          "orderId": 1,
          "productId": 1,
          "quantity": 2,
          "price": 150.00,
          "product": {
            "id": 1,
            "name": "Margherita Pizza",
            "image": "https://example.com/pizza.jpg",
            "price": 150.00
          }
        }
      ],
      "user": {
        "id": "uuid-string",
        "fullName": "John Doe",
        "mobileNumber": "+201234567890",
        "email": "john@example.com"
      }
    }
  ],
  "count": 1
}
```

**Error Response (403 - Admin Only):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

### Update Order Status

**Endpoint:** `PATCH /api/orders/:id`

**Description:** Updates the status of an order. Users can only cancel their own orders. Admins can update to any status.

**Auth Required:** Yes

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Status Values:**
- `PENDING`: Order is pending
- `COMPLETED`: Order is completed
- `CANCELLED`: Order is cancelled

**URL Parameters:**
- `id` (number, required): Order ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "userId": "uuid-string",
    "totalPrice": 460.00,
    "status": "COMPLETED",
    "location": "123 Main St, Cairo, Egypt",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "quantity": 2,
        "price": 150.00,
        "product": {
          "id": 1,
          "name": "Margherita Pizza",
          "image": "https://example.com/pizza.jpg",
          "price": 150.00
        }
      }
    ],
    "user": {
      "id": "uuid-string",
      "fullName": "John Doe",
      "mobileNumber": "+201234567890"
    }
  }
}
```

**Error Response (400 - Cannot Update):**
```json
{
  "success": false,
  "message": "Cannot update order with status: COMPLETED"
}
```

**Error Response (403 - Permission Denied):**
```json
{
  "success": false,
  "message": "You can only cancel your own orders. Only admins can complete orders."
}
```

---

### Delete Order (Admin)

**Endpoint:** `DELETE /api/orders/:id`

**Description:** Deletes an order. Only completed or cancelled orders can be deleted. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Order ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Order deleted successfully"
}
```

**Error Response (400 - Cannot Delete):**
```json
{
  "success": false,
  "message": "Only completed or cancelled orders can be deleted"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Order not found"
}
```

---

## Reviews

### Get Product Reviews

**Endpoint:** `GET /api/reviews/product/:productId`

**Description:** Retrieves all reviews for a specific product, ordered by creation date (newest first).

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `productId` (number, required): Product ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent pizza!",
      "userId": "uuid-string",
      "productId": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid-string",
        "fullName": "John Doe",
        "image": "https://example.com/user.jpg"
      }
    },
    {
      "id": 2,
      "rating": 4,
      "comment": "Good but could be better",
      "userId": "uuid-string-2",
      "productId": 1,
      "createdAt": "2024-01-02T00:00:00.000Z",
      "user": {
        "id": "uuid-string-2",
        "fullName": "Jane Doe",
        "image": "https://example.com/user2.jpg"
      }
    }
  ]
}
```

---

### Create Review

**Endpoint:** `POST /api/reviews/:productId`

**Description:** Creates a new review for a product. If the user already has a review for this product, it will be updated instead.

**Auth Required:** Yes (authenticateAndLoadUser)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent pizza! Highly recommend."
}
```

**Field Descriptions:**
- `rating` (number, required): Rating from 1 to 5
- `comment` (string, optional): Review comment (can be empty or null)

**URL Parameters:**
- `productId` (number, required): Product ID

**Query Parameters:** None

**Success Response (201 - Created):**
```json
{
  "success": true,
  "message": "Review created successfully",
  "data": {
    "id": 1,
    "rating": 5,
    "comment": "Excellent pizza! Highly recommend.",
    "userId": "uuid-string",
    "productId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "uuid-string",
      "fullName": "John Doe",
      "image": "https://example.com/user.jpg"
    }
  }
}
```

**Success Response (200 - Updated):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": {
    "id": 1,
    "rating": 5,
    "comment": "Excellent pizza! Highly recommend.",
    "userId": "uuid-string",
    "productId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "rating is required",
    "rating must be between 1 and 5"
  ]
}
```

**Error Response (404 - Product Not Found):**
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Note:** The product's average rating is automatically recalculated after creating or updating a review.

---

### Delete Review

**Endpoint:** `DELETE /api/reviews/:id`

**Description:** Deletes a review. Users can only delete their own reviews.

**Auth Required:** Yes (authenticateAndLoadUser)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**URL Parameters:**
- `id` (number, required): Review ID

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

**Error Response (403 - Permission Denied):**
```json
{
  "success": false,
  "message": "You can only delete your own reviews"
}
```

**Error Response (404 - Not Found):**
```json
{
  "success": false,
  "message": "Review not found"
}
```

**Note:** The product's average rating is automatically recalculated after deleting a review.

---

## Search

### Search Recommendations

**Endpoint:** `GET /api/search/recommendations`

**Description:** Searches for restaurants and products based on a query string. Returns matching restaurants and products.

**Auth Required:** No

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:**
- `q` (string, required): Search query
- `limit` (number, optional): Maximum number of results per category (default: 10, max: 20)

**Example Request:**
```
GET /api/search/recommendations?q=pizza&limit=5
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "uuid-string",
        "name": "Pizza Palace",
        "type": "Italian",
        "location": "Cairo, Egypt",
        "imageUrl": "https://example.com/restaurant.jpg",
        "rating": 4.5
      }
    ],
    "products": [
      {
        "id": 1,
        "name": "Margherita Pizza",
        "description": "Classic Italian pizza",
        "price": 150.00,
        "originalPrice": 180.00,
        "discountPercent": 17,
        "image": "https://example.com/pizza.jpg",
        "images": ["https://example.com/pizza.jpg"],
        "rate": 4.5,
        "isFeatured": true,
        "restaurant": {
          "id": "uuid-string",
          "name": "Pizza Palace",
          "imageUrl": "https://example.com/restaurant.jpg"
        },
        "category": {
          "id": 1,
          "name": "Pizza"
        }
      }
    ]
  }
}
```

**Empty Query Response (200):**
```json
{
  "success": true,
  "data": {
    "restaurants": [],
    "products": []
  }
}
```

**Error Response (500 - Server Error):**
```json
{
  "success": false,
  "message": "Search failed",
  "error": "Database query error"
}
```

---

## Admin

### Get Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Description:** Retrieves dashboard statistics including counts of users, restaurants, orders, categories, products, and total revenue. Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "users": {
      "total": 150
    },
    "restaurants": {
      "total": 25
    },
    "orders": {
      "total": 500,
      "pending": 50,
      "completed": 400,
      "cancelled": 50
    },
    "categories": {
      "total": 10
    },
    "products": {
      "total": 200
    },
    "revenue": {
      "total": 125000.50
    }
  }
}
```

**Error Response (403 - Admin Only):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

### Get All Users

**Endpoint:** `GET /api/admin/users`

**Description:** Retrieves all users in the system, ordered by creation date (newest first). Admin only.

**Auth Required:** Yes (authenticateAndLoadUser + requireAdmin)

**Request Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Request Body:** None

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "fullName": "John Doe",
      "mobileNumber": "+201234567890",
      "email": "john@example.com",
      "image": "https://example.com/user.jpg",
      "type": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-string-2",
      "fullName": "Admin User",
      "mobileNumber": "+201234567891",
      "email": "admin@example.com",
      "image": null,
      "type": "admin",
      "createdAt": "2023-12-01T00:00:00.000Z"
    }
  ]
}
```

**Error Response (403 - Admin Only):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

---

## Error Responses

All endpoints may return the following general error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please provide a valid authentication token."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Notes

1. **Authentication**: All authenticated endpoints require a Firebase ID token in the `Authorization` header as `Bearer <token>`.

2. **File Uploads**: For endpoints that support file uploads (products and categories), you can either:
   - Upload a file using `multipart/form-data` (the file will be uploaded to Cloudinary)
   - Provide an image URL in the request body as JSON

3. **Image URLs**: Image fields accept:
   - HTTP/HTTPS URLs
   - Base64 data URLs (for user profile images)
   - Cloudinary URLs (after file upload)

4. **Product Images**: Products support multiple images via the `images` field, which can be:
   - A JSON array of URLs: `["url1", "url2"]`
   - A JSON string: `"[\"url1\", \"url2\"]"`

5. **Order Status**: Order status can be:
   - `PENDING`: Order is pending
   - `COMPLETED`: Order is completed
   - `CANCELLED`: Order is cancelled

6. **User Types**: 
   - `user`: Regular user
   - `admin`: Administrator

7. **Rating**: Ratings are numeric values:
   - Product/restaurant ratings: 0 to 5
   - Review ratings: 1 to 5

8. **Pagination**: Currently, pagination is not implemented. All list endpoints return all matching records.

---

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: (Update with production URL)

---

**Last Updated:** 2024-01-01

