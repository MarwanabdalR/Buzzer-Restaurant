# 🧪 Testing Register API - Quick Start Guide

## What You Need to Do After Firebase Initialization

### Step 1: Install Required Dependencies

```bash
cd server/buzzer-backend
npm install firebase axios
```

### Step 2: Start Your Backend Server

Make sure your server is running:
```bash
npm run dev
```

The server should be running on `http://localhost:3000`

### Step 3: Get a Firebase ID Token

You have **3 options**:

#### Option A: Quick Token Generator (Easiest) ⭐
```bash
node get-token.js
```
This will create a test user and print the ID token. Copy it!

#### Option B: Full Test Script
```bash
node test-register.js
```
This will create a user, get token, AND call the register API automatically.

#### Option C: Manual (For Postman)
1. Use Firebase Console to create a user
2. Or use the browser console on your app page:
   ```javascript
   firebase.auth().currentUser.getIdToken().then(token => console.log(token));
   ```

### Step 4: Test in Postman

**Request Setup:**
- **Method:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Headers:**
  ```
  Content-Type: application/json
  ```
- **Body (raw JSON):**
  ```json
  {
    "fullName": "John Doe",
    "mobileNumber": "+1234567890",
    "idToken": "PASTE_YOUR_TOKEN_HERE"
  }
  ```

### Step 5: Expected Results

✅ **Success (201):** Returns user object with all fields

❌ **Error (400):** Validation error - check your data format
- `fullName` must be at least 3 characters
- `mobileNumber` must match pattern: `+?[0-9]{8,15}`

❌ **Error (401):** Invalid idToken - token expired or invalid

❌ **Error (400):** User already exists - user with this Firebase UID or mobile number already registered

---

## 📋 Quick Reference

### Valid Request Example:
```json
{
  "fullName": "Ahmed Mohamed",
  "mobileNumber": "+201234567890",
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6..."
}
```

### API Endpoint:
```
POST http://localhost:3000/api/auth/register
```

### Required Fields:
- `fullName` (string, min 3 chars)
- `mobileNumber` (string, format: +?[0-9]{8,15})
- `idToken` (string, valid Firebase ID token)

---

## 🚀 Quick Test Commands

```bash
# Install dependencies
npm install firebase axios

# Get token only
node get-token.js

# Full test (creates user + calls API)
node test-register.js
```

---

## 💡 Tips

1. **Token Expiration:** Firebase ID tokens expire after 1 hour. Generate a new one if you get 401 errors.

2. **Phone Number Format:** Must start with `+` and be 8-15 digits (e.g., `+201234567890`)

3. **Full Name:** Minimum 3 characters required

4. **Testing Multiple Times:** Each test creates a new Firebase user. If you want to reuse, modify the scripts to use existing credentials.

---

For more details, see `POSTMAN_TEST_GUIDE.md`

