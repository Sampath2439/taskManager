import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCkywH8qAR6O-j7mkvtcG-SpiIsRgvrRHc",
  authDomain: "taskmanagement-d4abb.firebaseapp.com",
  databaseURL: "https://taskmanagement-d4abb-default-rtdb.firebaseio.com",
  projectId: "taskmanagement-d4abb",
  storageBucket: "taskmanagement-d4abb.firebasestorage.app",
  messagingSenderId: "153946338136",
  appId: "1:153946338136:web:98d9c4b753b0cc9f82ab2d",
  measurementId: "G-L1DXZTBBSE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
