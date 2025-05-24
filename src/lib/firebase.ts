
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Log the environment variables to help debug
console.log("Firebase Config - Values from process.env BEFORE creating firebaseConfig object:");
console.log("NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
console.log("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
console.log("NEXT_PUBLIC_FIREBASE_PROJECT_ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
console.log("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
console.log("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
console.log("NEXT_PUBLIC_FIREBASE_APP_ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined = undefined;
let auth: Auth | undefined = undefined;
let storage: FirebaseStorage | undefined = undefined;

if (getApps().length === 0) {
  let configIsValid = true;
  if (!firebaseConfig.apiKey || typeof firebaseConfig.apiKey !== 'string' || firebaseConfig.apiKey.trim() === '') {
    console.error("Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_API_KEY is missing, empty, or not a string. Check your .env.local file and restart your server. Value received:", firebaseConfig.apiKey);
    configIsValid = false;
  }
  if (!firebaseConfig.authDomain || typeof firebaseConfig.authDomain !== 'string' || firebaseConfig.authDomain.trim() === '') {
    console.error("Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is missing, empty, or not a string. Check your .env.local file and restart your server. Value received:", firebaseConfig.authDomain);
    configIsValid = false;
  }
  if (!firebaseConfig.projectId || typeof firebaseConfig.projectId !== 'string' || firebaseConfig.projectId.trim() === '') {
    console.error("Firebase Configuration Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing, empty, or not a string. Check your .env.local file and restart your server. Value received:", firebaseConfig.projectId);
    configIsValid = false;
  }
  // Add other essential key checks if necessary for other Firebase services, e.g., storageBucket
   if (!firebaseConfig.storageBucket || typeof firebaseConfig.storageBucket !== 'string' || firebaseConfig.storageBucket.trim() === '') {
    console.warn("Firebase Configuration Warning: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is missing or empty. File uploads will fail. Value received:", firebaseConfig.storageBucket);
    // Not making configIsValid false, as auth might still work, but storage won't.
  }


  if (configIsValid) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("Firebase app initialized successfully with the provided config.");
    } catch (error: any) {
      console.error("Firebase initialization failed with an exception. This often means the config values are present but still incorrect (e.g., wrong format, or project doesn't exist for these credentials):", error.message);
      configIsValid = false; 
    }
  } else {
    console.error("Firebase config is incomplete or invalid due to the issues logged above. Firebase app was NOT initialized. Please check your .env.local file thoroughly and restart your server.");
  }
} else {
  app = getApps()[0];
  console.log("Firebase app already initialized.");
}

if (app) {
  try {
    auth = getAuth(app);
    storage = getStorage(app); // Initialize Firebase Storage
    console.log("Firebase Auth and Storage initialized successfully.");
  } catch (error: any) {
     console.error("Firebase getAuth(app) or getStorage(app) failed. This can happen if the app object is not a valid FirebaseApp instance or if config (like storageBucket) is missing/invalid:", error.message);
  }
} else {
  console.error("Firebase app was not initialized (app is undefined), so Firebase Auth and Storage cannot be initialized. Please check configuration issues logged above and ensure your .env.local file is correct and the server was restarted.");
}

export { app, auth, storage };
