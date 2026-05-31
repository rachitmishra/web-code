import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signInWithPhone, verifyOtp, signOutUser } from './authService';
import { signInWithPhoneNumber, signOut } from 'firebase/auth';

vi.mock('firebase/auth', async () => {
  return {
    getAuth: vi.fn(),
    signInWithPhoneNumber: vi.fn(),
    signOut: vi.fn(),
    RecaptchaVerifier: class {
      render = vi.fn();
      clear = vi.fn();
    },
  };
});

vi.mock('../lib/firebase', () => ({
  auth: {
    app: {
      options: {
        apiKey: 'test-api-key'
      }
    }
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('signInWithPhone should call firebase signInWithPhoneNumber', async () => {
    // Create container for reCAPTCHA
    const containerId = 'recaptcha-container';
    document.body.innerHTML = `<div id="${containerId}"></div>`;

    const mockConfirmationResult = { confirm: vi.fn() };
    (signInWithPhoneNumber as any).mockResolvedValue(mockConfirmationResult);

    const phoneNumber = '+1234567890';
    // Mock RecaptchaVerifier instance if needed, but here we just pass a dummy container ID
    const result = await signInWithPhone(phoneNumber, containerId);

    expect(signInWithPhoneNumber).toHaveBeenCalledWith(expect.anything(), phoneNumber, expect.anything());
    expect(result).toBe(mockConfirmationResult);
  });

  it('verifyOtp should call confirm on confirmationResult', async () => {
    const mockUserCredential = { user: { uid: '123' } };
    const mockConfirmationResult = {
      confirm: vi.fn().mockResolvedValue(mockUserCredential),
    };

    const otp = '123456';
    const result = await verifyOtp(mockConfirmationResult as any, otp);

    expect(mockConfirmationResult.confirm).toHaveBeenCalledWith(otp);
    expect(result).toBe(mockUserCredential);
  });

  it('signOutUser should call firebase signOut', async () => {
    await signOutUser();
    expect(signOut).toHaveBeenCalled();
  });
});
