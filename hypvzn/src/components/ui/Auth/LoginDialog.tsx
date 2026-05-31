import React, { useState, useEffect } from 'react';
import { useFetcher, useNavigate, useLocation } from 'react-router';
import PhoneSignIn from './PhoneSignIn';
import OtpVerification from './OtpVerification';
import { signInWithPhone, verifyOtp } from '../../../services/authService';
import { useDebug } from '../../../hooks/useDebug';
import styles from './LoginDialog.module.css';

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const actionData = fetcher.data as { success: boolean, role: string, target?: string, error?: string } | undefined;
  const { addDebugError } = useDebug();

  const location = useLocation();

  const [handledSuccess, setHandledSuccess] = useState(false);

  useEffect(() => {
    if (actionData && isOpen) {
      console.log("[LoginDialog] Received actionData:", actionData);
      if (actionData.success) {
        if (handledSuccess) return;
        setHandledSuccess(true);

        const target = actionData.target || '/profile';
        console.log(`[LoginDialog] Login success, navigating to: ${target}`);
        
        // Try SPA navigation
        navigate(target, { replace: true });
        
        // Fallback: If still on same page after 500ms, force a hard redirect
        const timeoutId = setTimeout(() => {
          if (window.location.pathname !== target) {
            console.warn("[LoginDialog] SPA navigation seems stuck, forcing hard redirect");
            window.location.href = target;
          }
        }, 500);
        
        onClose();
        return () => clearTimeout(timeoutId);
      } else {
        const errMsg = actionData.error || 'Server error during login';
        setError(errMsg);
        addDebugError(errMsg, 'LoginAction');
        setLoading(false);
      }
    }
  }, [actionData, navigate, onClose, addDebugError, isOpen, handledSuccess]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setStep('phone');
      setConfirmationResult(null);
      setLoading(false);
      setError('');
      setHandledSuccess(false);
    }
  }, [isOpen]);

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber, 'recaptcha-container-dialog');
      setConfirmationResult(result);
      setStep('otp');
    } catch (err: any) {
      console.error('[LoginDialog] Phone Sign-In Error:', err);
      setError(err.message || 'Failed to send code');
      addDebugError(err.message || 'Failed to send code', 'FirebaseSignIn');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      console.log('[LoginDialog] Verifying OTP...');
      const userCredential = await verifyOtp(confirmationResult, otp);
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Login failed: No user data returned from Firebase.');
      }

      const idToken = await userCredential.user.getIdToken();
      console.log('[LoginDialog] OTP verified, submitting to server action...');
      
      // Use fetcher to submit without navigation. Pass current location for redirect.
      fetcher.submit(
        { idToken, uid: userCredential.user.uid, from: location.pathname }, 
        { method: "post", action: "/login" }
      );
    } catch (err: any) {
      console.error('[LoginDialog] OTP Verification Error:', err);
      let errMsg = 'Invalid code. Please try again.';
      
      if (err.code === 'auth/invalid-verification-code') {
        errMsg = 'The verification code is incorrect. Please check and try again.';
      } else if (err.code === 'auth/code-expired') {
        errMsg = 'The verification code has expired. Please request a new one.';
      } else if (err.message) {
        errMsg = err.message;
      }
      
      setError(errMsg);
      addDebugError(errMsg, 'FirebaseVerifyOTP');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        
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
          
          {/* Recaptcha container unique ID for dialog */}
          <div id="recaptcha-container-dialog"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;
