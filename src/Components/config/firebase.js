import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';

const app = firebase.initializeApp({
    apiKey: "AIzaSyBHIIMrtVoq9L3dT8RllI0TByVOmwQZWhc",
    authDomain: "projecthorizon-c61df.firebaseapp.com",
    projectId: "projecthorizon-c61df",
    storageBucket: "projecthorizon-c61df.appspot.com",
    messagingSenderId: "478137911337",
    appId: "1:478137911337:web:6f5e96d06b0c365eaf7438"
});

export const authApp = app.auth();
export const storageApp = app.storage();
export const firestoreApp = app.firestore();
export const timestamp = firebase.firestore.FieldValue.serverTimestamp;