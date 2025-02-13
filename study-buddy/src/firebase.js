// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsSDrxr5HihttFWT6AsqieOm50wuuINr0",
  authDomain: "egr302-study-buddy.firebaseapp.com",
  projectId: "egr302-study-buddy",
  storageBucket: "egr302-study-buddy.firebasestorage.app",
  messagingSenderId: "1086319398149",
  appId: "1:1086319398149:web:cc708ace55be8b4f567b6c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firebase services and app instance
export { app, db, auth };
