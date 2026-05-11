import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSubmit, useActionData } from 'react-router';
import PhoneSignIn from '../components/ui/Auth/PhoneSignIn';
import OtpVerification from '../components/ui/Auth/OtpVerification';
import { signInWithPhone, verifyOtp } from '../services/authService';
import Card from '../components/ui/Card/Card';
import styles from './Login.module.css';

// Re-export action from server-only module
export { action } from './Login.server';

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const submit = useSubmit();
  const actionData = useActionData() as { success: boolean, role?: string, target?: string, error?: string, stack?: string };
  
  const [handledSuccess, setHandledSuccess] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get("from") || (location.state as any)?.from?.pathname;

  // Handle actionData results
  useEffect(() => {
    if (actionData) {
      console.log("[LoginPage] Received actionData:", actionData);
      
      if (actionData.success) {
        if (handledSuccess) return;
        setHandledSuccess(true);

        // Success: Clear local cart and perform client-side redirect
        (async () => {
          try {
            const { saveLocalCart } = await import('../services/cartService');
            saveLocalCart([]);
          } catch (err) {
            console.warn("[LoginPage] Failed to clear local cart after login:", err);
          }
        })();

        const target = actionData.target || '/profile';
        console.log(`[LoginPage] Login success, navigating to: ${target}`);
        
        // Try SPA navigation first
        navigate(target, { replace: true });
        
        // Fallback: If still on same page after 500ms, force a hard redirect
        const timeoutId = setTimeout(() => {
          if (window.location.pathname !== target) {
            console.warn("[LoginPage] SPA navigation seems stuck, forcing hard redirect");
            window.location.href = target;
          }
        }, 500);
        
        return () => clearTimeout(timeoutId);
      } else {
        // Error: Show message and reset loading
        setError(actionData.error || 'Login failed');
        if (actionData.stack) {
          console.error("[LoginPage] Server Stack Trace:", actionData.stack);
        }
        setLoading(false);
      }
    }
  }, [actionData, navigate]);

  // Force loading to false on mount to prevent stuck state from previous sessions
  useEffect(() => {
    setLoading(false);
  }, []);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber, 'recaptcha-container');
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      if (err.code === 'auth/captcha-check-failed') {
        setError('Security check failed (hostname mismatch). Please ensure your domain/IP is added to Authorized Domains in Firebase Console.');
      } else {
        setError(err.message || 'Failed to send code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      console.log('[LoginPage] Verifying OTP...');
      const userCredential = await verifyOtp(confirmationResult, otp);
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Login failed: No user data returned from Firebase.');
      }

      const idToken = await userCredential.user.getIdToken();
      console.log('[LoginPage] OTP verified, preparing local cart items for sync...');
      
      let localItems = "[]";
      try {
        const { getLocalCart } = await import('../services/cartService');
        const items = getLocalCart();
        localItems = JSON.stringify(items);
      } catch (err) {
        console.warn('[LoginPage] Failed to read local cart for sync:', err);
      }

      console.log('[LoginPage] OTP verified, submitting to server action...');
      
      // Send token and local items to server to set secure cookie and sync cart.
      submit({ 
        idToken, 
        uid: userCredential.user.uid, 
        from: from || '',
        localCartItems: localItems
      }, { method: "post" });
    } catch (err: any) {
      console.error('[LoginPage] OTP Verification Error:', err);
      let errMsg = 'Invalid code. Please try again.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'The verification code is incorrect. Please check and try again.';
      } else if (err.code === 'auth/code-expired') {
        errMsg = 'The verification code has expired. Please request a new one.';
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setError(errMsg);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.cardContent}>
          <div className={styles.illustration}>
            {step === 'phone' ? '✨' : '🔐'}
          </div>
          
          <h1 className={styles.title}>
            {step === 'phone' ? 'Welcome Back' : 'Security Check'}
          </h1>
          
          <p className={styles.subtitle}>
            {step === 'phone' 
              ? 'Sign in to access your boutique experience' 
              : 'Enter the code we sent to your mobile'}
          </p>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <PhoneSignIn onSubmit={handlePhoneSubmit} loading={loading} />
          ) : (
            <OtpVerification onVerify={handleOtpVerify} loading={loading} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login;
