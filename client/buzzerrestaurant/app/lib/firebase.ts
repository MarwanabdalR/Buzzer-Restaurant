import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
}

// Initialize Auth (only on client side)
export const auth: Auth | null = typeof window !== 'undefined' ? getAuth(app) : null;

// ReCAPTCHA Verifier factory function
export const createRecaptchaVerifier = (containerId: string): RecaptchaVerifier => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }

  return new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved - will proceed with phone auth
    },
    'expired-callback': () => {
      // Response expired. Ask user to solve reCAPTCHA again.
      console.log('reCAPTCHA expired');
    },
  });
};

export const sendOTP = async (phoneNumber: string, verifier: RecaptchaVerifier): Promise<any> => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return confirmationResult;
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult: any, code: string): Promise<any> => {
  try {
    const result = await confirmationResult.confirm(code);
    return result;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const getIdToken = async (): Promise<string | null> => {
  try {
    if (!auth) {
      return null;
    }
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

export default app;

