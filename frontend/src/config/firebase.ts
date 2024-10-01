// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDoiPt7xaBnKM-V2C0c4Wi5GUfakzSglg8',
  authDomain: 'flashy-10dc4.firebaseapp.com',
  projectId: 'flashy-10dc4',
  storageBucket: 'flashy-10dc4.appspot.com',
  messagingSenderId: '403557335811',
  appId: '1:403557335811:web:ee23c5291cb15f10015f36',
  measurementId: 'G-QD4TWMTZSC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const db = getFirestore(app);
