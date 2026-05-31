import admin from 'firebase-admin';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import fs from 'node:fs';
import path from 'node:path';

if (!admin.apps.length) {
  const projectId = (import.meta.env?.VITE_FIREBASE_PROJECT_ID) || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_PROJECT_ID : undefined);
  if (!projectId) {
    console.error('[Firebase Admin] VITE_FIREBASE_PROJECT_ID is missing! Firebase Admin will likely fail.');
  }

  const serviceAccountFilePath = (import.meta.env?.VITE_FIREBASE_SERVICE_ACCOUNT_FILE_PATH) || (typeof process !== 'undefined' ? process.env.VITE_FIREBASE_SERVICE_ACCOUNT_FILE_PATH : undefined);
  
  if (serviceAccountFilePath) {
    const serviceAccountPath = path.resolve(process.cwd(), serviceAccountFilePath);
    console.log(`[Firebase Admin] Attempting to load service account from: ${serviceAccountPath}`);
    
    if (fs.existsSync(serviceAccountPath)) {
      console.log('[Firebase Admin] Service account file found. Initializing...');
      try {
        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: `${projectId}.firebasestorage.app`
        });
      } catch (err) {
        console.error('[Firebase Admin] Failed to parse or initialize with service account file:', err);
        admin.initializeApp({
          projectId: projectId,
          storageBucket: `${projectId}.firebasestorage.app`
        });
      }
    } else {
      console.warn(`[Firebase Admin] Service account file NOT found at: ${serviceAccountPath}`);
      admin.initializeApp({
        projectId: projectId,
        storageBucket: `${projectId}.firebasestorage.app`
      });
    }
  } else {
    console.warn('[Firebase Admin] VITE_FIREBASE_SERVICE_ACCOUNT_FILE_PATH is not defined. Falling back to default credentials.');
    admin.initializeApp({
      projectId: projectId,
      storageBucket: `${projectId}.firebasestorage.app`
    });
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
export const adminStorage = getStorage();
export { FieldValue, admin };
