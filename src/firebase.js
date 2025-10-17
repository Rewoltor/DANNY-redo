// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBIKyohpoENAAmXcWwu7Q8pOjonRvy5g_E',
  authDomain: 'danny-redo.firebaseapp.com',
  projectId: 'danny-redo',
  storageBucket: 'danny-redo.firebasestorage.app',
  messagingSenderId: '861664122007',
  appId: '1:861664122007:web:75c78636338e2f9b4d05d2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firestore database
export const db = getFirestore(app);

export default app;
