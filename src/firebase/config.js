import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDyhlIhUZnvwv1Kwt45PJLOS5q9xu1qwuo",
    authDomain: "realestate-edc8a.firebaseapp.com",
    projectId: "realestate-edc8a",
    storageBucket: "realestate-edc8a.firebasestorage.app",
    messagingSenderId: "560090370426",
    appId: "1:560090370426:web:959fb4571026bc0e4c06c3",
    measurementId: "G-KF52PKG147"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);