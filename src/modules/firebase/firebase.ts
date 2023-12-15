import { initializeApp, getApps } from 'firebase/app';
import { FirebaseApp } from 'firebase/app';

if (
  !process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY ||
  !process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  !process.env.NEXT_PUBLIC_FIREBASE_APP_ID
) {
  throw new Error('Missing required Firebase environment variables');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const apps = getApps();
const app: FirebaseApp = apps.length ? apps[0] : initializeApp(firebaseConfig);

export default app;
