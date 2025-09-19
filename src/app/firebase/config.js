
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBmAYBIvSwxHBCpTPBZHifxrRRI8_CsFoE",
  authDomain: "project-5f97c.firebaseapp.com",
  projectId: "project-5f97c",
  storageBucket: "project-5f97c.firebasestorage.app",
  messagingSenderId: "143683611540",
  appId: "1:143683611540:web:4e1ada087e95787330bd81",
  measurementId: "G-0X2CT5FX56"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {app, auth, provider};
