import admin from 'firebase-admin';
import path from 'path';

// Initializing Firebase Admin SDK
try {
  if (!admin.apps.length) {
    let credential;

    // Check if we have the service account as an environment variable (Production)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      credential = admin.credential.cert(serviceAccount);
    } else {
      // Fallback to local file (Development)
      const serviceAccountPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
      credential = admin.credential.cert(serviceAccountPath);
    }

    admin.initializeApp({ credential });
    console.log("Firebase Admin successfully initialized.");
  }
} catch (error) {
  console.error("Firebase Admin initialization error:", error);
}

export const db = admin.firestore();
