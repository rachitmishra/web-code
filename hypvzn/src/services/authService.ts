import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
  type UserCredential,
  signOut,
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Module-level variable to persist the verifier instance
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    } catch (e) {
      console.warn("[AuthService] Error clearing reCAPTCHA:", e);
    }
  }
};

export const signInWithPhone = async (
  phoneNumber: string,
  containerId: string
): Promise<ConfirmationResult> => {
  // Check if Firebase is properly configured
  if (!auth.app.options.apiKey || auth.app.options.apiKey === 'undefined') {
    if (import.meta.env.DEV) {
      console.warn('[AuthService] Using MOCK Phone Sign-In because VITE_FIREBASE_API_KEY is missing.');
      // Return a mock ConfirmationResult for testing in development
      return {
        confirm: async (otp: string) => {
          if (otp === '123456') {
            console.log('[AuthService] MOCK OTP Verified (123456)');
            return {
              user: {
                uid: 'mock-user-123',
                email: 'mock@example.com',
                phoneNumber: phoneNumber,
                getIdToken: async () => 'mock-id-token-123',
              }
            } as any;
          }
          throw { code: 'auth/invalid-verification-code', message: 'Invalid mock code. Use 123456' };
        },
        verificationId: 'mock-verification-id'
      } as any;
    }
    throw new Error('Firebase is not configured. Please add a valid VITE_FIREBASE_API_KEY to your .env file.');
  }

  // If a verifier already exists, clear it before creating a new one to avoid 
  // the "reCAPTCHA has already been rendered" error on retries.
  clearRecaptcha();

  // Ensure the container exists in the DOM before initializing
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`reCAPTCHA container with id "${containerId}" not found.`);
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });

  try {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error: any) {
    // If it fails with captcha-check-failed, it's often a hostname mismatch 
    // in Firebase Console (Authentication > Settings > Authorized domains).
    if (error.code === 'auth/captcha-check-failed') {
      console.error(
        "[AuthService] reCAPTCHA check failed. Check if your current domain/IP is added to " +
        "the Authorized Domains in your Firebase Console."
      );
    }
    throw error;
  }
};

export const verifyOtp = async (
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<UserCredential> => {
  return confirmationResult.confirm(otp);
};

export const signOutUser = async (): Promise<void> => {
  return signOut(auth);
};
