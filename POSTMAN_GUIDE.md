# Postman Guide for Restaurant APIs

## Prerequisites
1. You need an admin user account (type: 'admin' in database)
2. Get a Firebase ID Token from your authentication flow
3. Base URL: `http://localhost:3000/api/restaurants`

## Authentication
All admin endpoints require a Firebase ID Token in the Authorization header:
```
Authorization: Bearer <your-firebase-id-token>
```

## Endpoints

### 1. GET All Restaurants (Public)
**Endpoint:** `GET http://localhost:3000/api/restaurants`

**Headers:**
- None required

**Example Response:**
```json
{
  "success": true,
  "message": "Restaurants retrieved successfully",
  "data": [
    {
      "id": "uuid-here",
      "name": "The Skye",
      "type": "Restaurant",
      "location": "Main market Riyadh, KSA",
      "rating": 4.0,
      "imageUrl": "https://res.cloudinary.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2. GET Restaurant by ID (Public)
**Endpoint:** `GET http://localhost:3000/api/restaurants/:id`

**Headers:**
- None required

**Example:**
```
GET http://localhost:3000/api/restaurants/123e4567-e89b-12d3-a456-426614174000
```

---

### 3. CREATE Restaurant (Admin Only)
**Endpoint:** `POST http://localhost:3000/api/restaurants`

**Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "The Skye",
  "type": "Restaurant",
  "location": "Main market Riyadh, KSA",
  "rating": 4.5,
  "imageUrl": "https://res.cloudinary.com/dsobcez1a/image/upload/v1234567890/restaurant.jpg"
}
```

**Required Fields:**
- `name` (string, 1-200 chars)
- `type` (string, 1-100 chars)
- `location` (string, 1-500 chars)

**Optional Fields:**
- `rating` (number, 0-5, default: 0)
- `imageUrl` (string, valid URL or null)

**Example Response:**
```json
{
  "success": true,
  "message": "Restaurant created successfully",
  "data": {
    "id": "uuid-generated",
    "name": "The Skye",
    "type": "Restaurant",
    "location": "Main market Riyadh, KSA",
    "rating": 4.5,
    "imageUrl": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Postman Steps:**
1. Create new request
2. Set method to `POST`
3. Enter URL: `http://localhost:3000/api/restaurants`
4. Go to **Headers** tab:
   - Add `Authorization`: `Bearer <your-token>`
   - Add `Content-Type`: `application/json`
5. Go to **Body** tab → Select **raw** → Select **JSON**
6. Paste the JSON body above
7. Click **Send**

---

### 4. UPDATE Restaurant (Admin Only)
**Endpoint:** `PATCH http://localhost:3000/api/restaurants/:id`

**Headers:**
```
Authorization: Bearer <firebase-id-token>
Content-Type: application/json
```

**Body (JSON):** - At least one field required
```json
{
  "name": "Updated Restaurant Name",
  "rating": 4.8,
  "imageUrl": "https://res.cloudinary.com/dsobcez1a/image/upload/v1234567890/new-image.jpg"
}
```

**Optional Fields (at least one must be provided):**
- `name` (string, 1-200 chars)
- `type` (string, 1-100 chars)
- `location` (string, 1-500 chars)
- `rating` (number, 0-5)
- `imageUrl` (string, valid URL or null)

**Example:**
```
PATCH http://localhost:3000/api/restaurants/123e4567-e89b-12d3-a456-426614174000
```

**Postman Steps:**
1. Create new request
2. Set method to `PATCH`
3. Enter URL: `http://localhost:3000/api/restaurants/{restaurant-id}`
4. Go to **Headers** tab:
   - Add `Authorization`: `Bearer <your-token>`
   - Add `Content-Type`: `application/json`
5. Go to **Body** tab → Select **raw** → Select **JSON**
6. Paste the JSON body with fields you want to update
7. Click **Send**

---

### 5. DELETE Restaurant (Admin Only)
**Endpoint:** `DELETE http://localhost:3000/api/restaurants/:id`

**Headers:**
```
Authorization: Bearer <firebase-id-token>
```

**Example:**
```
DELETE http://localhost:3000/api/restaurants/123e4567-e89b-12d3-a456-426614174000
```

**Example Response:**
```json
{
  "success": true,
  "message": "Restaurant deleted successfully"
}
```

**Postman Steps:**
1. Create new request
2. Set method to `DELETE`
3. Enter URL: `http://localhost:3000/api/restaurants/{restaurant-id}`
4. Go to **Headers** tab:
   - Add `Authorization`: `Bearer <your-token>`
5. Click **Send**

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized. Please provide a valid authentication token."
}
```

### 403 Forbidden (Not Admin)
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 400 Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "details": [
    "Restaurant name must be at least 1 character",
    "Rating must be at least 0"
  ]
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

---

## How to Get Firebase ID Token

1. **Through your app:**
   - Login through your app
   - Open browser DevTools → Console
   - Run: `await firebase.auth().currentUser.getIdToken()`
   - Copy the token

2. **Through Firebase Admin SDK (for testing):**
   - Use Firebase Admin SDK to generate a custom token
   - Or use your existing authentication flow

---

## Quick Postman Collection Setup

1. Create a new Collection: "Restaurant APIs"
2. Add a collection variable:
   - Variable: `baseUrl`
   - Value: `http://localhost:3000/api`
   - Variable: `token`
   - Value: `<your-firebase-token>` (update this when it expires)

3. Use variables in requests:
   - URL: `{{baseUrl}}/restaurants`
   - Authorization Header: `Bearer {{token}}`

---

## Example: Complete Create Restaurant Request

**Method:** POST  
**URL:** `http://localhost:3000/api/restaurants`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMzQ1NiJ9...
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Al Nakheel",
  "type": "Cafe",
  "location": "Main market Riyadh, KSA",
  "rating": 4.2,
  "imageUrl": "https://res.cloudinary.com/dsobcez1a/image/upload/v1234567890/al-nakheel.jpg"
}
```

