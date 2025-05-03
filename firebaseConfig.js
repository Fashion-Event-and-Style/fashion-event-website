// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqGF6w1DMGyrNAdtSiuZ6bqtOFWpLexEU",
  authDomain: "fashion-event-app-f7cd4.firebaseapp.com",
  projectId: "fashion-event-app-f7cd4",
  storageBucket: "fashion-event-app-f7cd4.firebasestorage.app",
  messagingSenderId: "306382216728",
  appId: "1:306382216728:web:621ab2bab27ecc0694ad6d",
  measurementId: "G-8MSJ8DX38L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };