// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCD5rqQojQV9KDCdB_IZk6seGizRnAoC4",
  authDomain: "fashion-event-app-ab310.firebaseapp.com",
  projectId: "fashion-event-app-ab310",
  storageBucket: "fashion-event-app-ab310.appspot.com",
  messagingSenderId: "862718077597",
  appId: "1:862718077597:web:cca8c0fd360e845efb4274",
  measurementId: "G-QQGPSJSE9M"
};

const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = getAuth(FIREBASE_APP);
const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_STORAGE };
