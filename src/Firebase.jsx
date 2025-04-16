import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC4utyKH_Spo7QCkjpDMtRxLkMTUyn9DGs",
  authDomain: "chinju-39519.firebaseapp.com",
  databaseURL: "https://chinju-39519-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chinju-39519",
  storageBucket: "chinju-39519.appspot.com", // Keep this for completeness but not used
  messagingSenderId: "260308970196",
  appId: "1:260308970196:web:4cc4537677b9eabf9aa941",
  measurementId: "G-48S7RFF1ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const realtimeDb = getDatabase(app);
const db = getFirestore(app);

// Enable persistent authentication
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase persistence enabled');
  })
  .catch((error) => {
    console.error('Error enabling persistence:', error);
  });

export { auth, realtimeDb, db };
export default app;
