# Postman Testing Guide for Register API

## Prerequisites

1. **Install dependencies** (if not already installed):
   ```bash
   npm install axios firebase
   ```

2. **Make sure your backend server is running**:
   ```bash
   npm run dev
   ```
   Server should be running on `http://localhost:3000`

## Method 1: Using the Test Script (Recommended)

### Step 1: Run the test script
```bash
node test-register.js
```

This script will:
- Create a Firebase user
- Get an ID token
- Call the register API automatically

### Step 2: Copy the ID token from the output
The script will display the ID token. Copy it for use in Postman.

## Method 2: Manual Postman Testing

### Step 1: Get Firebase ID Token

You have two options:

#### Option A: Use the test script to get token only
Modify `test-register.js` to just print the token, or run it and copy the token from console.

#### Option B: Use Firebase Console
1. Go to Firebase Console → Authentication
2. Create a test user manually
3. Use Firebase Web SDK in browser console to get token:
   ```javascript
   // In browser console (on your app page)
   firebase.auth().currentUser.getIdToken().then(token => console.log(token));
   ```  

### Step 2: Setup Postman Request

**Request Type:** `POST`

**URL:** `http://localhost:3000/api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "fullName": "John Doe",
  "mobileNumber": "+1234567890",
  "idToken": "YOUR_FIREBASE_ID_TOKEN_HERE"
}
```

### Step 3: Expected Response

**Success (201):**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "mobileNumber": "+1234567890",
  "firebaseUid": "abc123...",
  "email": null,
  "password": null,
  "image": null,
  "type": null,
  "createdAt": "2025-12-16T...",
  "updatedAt": "2025-12-16T..."
}
```

**Error (400) - Validation Error:**
```json
{
  "message": "Validation error",
  "details": ["fullName is required", "mobileNumber must match pattern..."]
}
```

**Error (401) - Invalid Token:**
```json
{
  "message": "Invalid idToken"
}
```

**Error (400) - User Already Exists:**
```json
{
  "message": "User already exists"
}
```

## Test Data Examples

### Valid Test Data:
```json
{
  "fullName": "Ahmed Ali",
  "mobileNumber": "+201234567890",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

### Invalid Test Data (for testing validation):
```json
{
  "fullName": "AB",  // Too short (min 3 characters)
  "mobileNumber": "123",  // Invalid format
  "idToken": "invalid-token"
}
```

## Quick Token Generator Script

Create a simple script to just get a token:

```javascript
// get-token.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCFoGOtaBBjywycYqZP2Q9hl_L_muh-rTk",
  authDomain: "buzzer-app-7c135.firebaseapp.com",
  projectId: "buzzer-app-7c135",
  storageBucket: "buzzer-app-7c135.firebasestorage.app",
  messagingSenderId: "222436192124",
  appId: "1:222436192124:web:48d7af508d26fe54a47ef9",
  measurementId: "G-TNVHEJL9L9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = `test${Date.now()}@example.com`;
const password = "Test123456!";

createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    const token = await userCredential.user.getIdToken();
    console.log("\n✅ ID Token:");
    console.log(token);
    console.log("\n📋 Use this token in Postman!");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

Run: `node get-token.js`

