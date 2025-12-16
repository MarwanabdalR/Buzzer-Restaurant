// Test script for Register API
// This script will:
// 1. Initialize Firebase
// 2. Create/authenticate a test user
// 3. Get Firebase ID token
// 4. Call the register API with axios

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import axios from "axios";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFoGOtaBBjywycYqZP2Q9hl_L_muh-rTk",
  authDomain: "buzzer-app-7c135.firebaseapp.com",
  projectId: "buzzer-app-7c135",
  storageBucket: "buzzer-app-7c135.firebasestorage.app",
  messagingSenderId: "222436192124",
  appId: "1:222436192124:web:48d7af508d26fe54a47ef9",
  measurementId: "G-TNVHEJL9L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// API endpoint (adjust if your server runs on a different port)
const API_BASE_URL = "http://localhost:3000/api/auth";

/**
 * Test Register API with email/password authentication
 */
async function testRegisterWithEmail() {
  try {
    console.log("🔥 Step 1: Initializing Firebase...");
    
    // Test credentials (change these to your test values)
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = "Test123456!";
    const testFullName = "Test User";
    const testMobileNumber = "+1234567890"; // Change to a valid phone number format

    console.log(`📧 Creating test user with email: ${testEmail}`);

    // Step 2: Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      testEmail, 
      testPassword
    );
    
    console.log("✅ Firebase user created successfully!");
    console.log(`   User UID: ${userCredential.user.uid}`);

    // Step 3: Get ID token
    const idToken = await userCredential.user.getIdToken();
    console.log("✅ ID Token obtained!");
    console.log(`   Token (first 50 chars): ${idToken.substring(0, 50)}...`);

    // Step 4: Call Register API
    console.log("\n📡 Step 4: Calling Register API...");
    const registerData = {
      fullName: testFullName,
      mobileNumber: testMobileNumber,
      idToken: idToken
    };

    console.log("Request payload:", {
      fullName: registerData.fullName,
      mobileNumber: registerData.mobileNumber,
      idToken: `${registerData.idToken.substring(0, 30)}...`
    });

    const response = await axios.post(`${API_BASE_URL}/register`, registerData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("\n✅ Register API Success!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error("\n❌ Error occurred:");
    if (error.response) {
      // API error
      console.error("Status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    } else if (error.code) {
      // Firebase error
      console.error("Firebase Error Code:", error.code);
      console.error("Firebase Error Message:", error.message);
    } else {
      console.error("Error:", error.message);
    }
  }
}

/**
 * Test Register API with existing user (login first, then register)
 */
async function testRegisterWithExistingUser() {
  try {
    console.log("🔥 Testing with existing Firebase user...");
    
    // Use existing credentials
    const testEmail = "existing@example.com"; // Change to your existing user
    const testPassword = "YourPassword123!"; // Change to your password
    const testFullName = "Existing User";
    const testMobileNumber = "+1234567891";

    // Step 1: Sign in existing user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      testEmail,
      testPassword
    );

    console.log("✅ Signed in successfully!");
    
    // Step 2: Get ID token
    const idToken = await userCredential.user.getIdToken();
    console.log("✅ ID Token obtained!");

    // Step 3: Call Register API
    const registerData = {
      fullName: testFullName,
      mobileNumber: testMobileNumber,
      idToken: idToken
    };

    const response = await axios.post(`${API_BASE_URL}/register`, registerData, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("\n✅ Register API Success!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error("\n❌ Error occurred:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error:", error.message);
    }
  }
}

// Run the test
console.log("=".repeat(60));
console.log("🧪 Register API Test Script");
console.log("=".repeat(60));
console.log("\nChoose test mode:");
console.log("1. Create new user and register (default)");
console.log("2. Use existing user and register");
console.log("\nRunning test mode 1...\n");

testRegisterWithEmail();

// Uncomment to test with existing user:
// testRegisterWithExistingUser();

