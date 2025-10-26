// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebaseSecret } from '../secrets';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebaseSecret.apiKey,
  authDomain: firebaseSecret.authDomain,
  projectId: firebaseSecret.projectId,
  storageBucket: firebaseSecret.storageBucket,
  messagingSenderId: firebaseSecret.messagingSenderId,
  appId: firebaseSecret.appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore database
export const db = getFirestore(app);

export default app;
