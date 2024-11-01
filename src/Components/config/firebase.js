import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const app = initializeApp({
    apiKey: "AIzaSyBHIIMrtVoq9L3dT8RllI0TByVOmwQZWhc",
    authDomain: "projecthorizon-c61df.firebaseapp.com",
    projectId: "projecthorizon-c61df",
    storageBucket: "projecthorizon-c61df.appspot.com",
    messagingSenderId: "478137911337",
    appId: "1:478137911337:web:6f5e96d06b0c365eaf7438"
});

export const authApp = getAuth(app);
export const storageApp = getStorage(app);
export const firestoreApp = getFirestore(app);
export const timestamp = serverTimestamp;