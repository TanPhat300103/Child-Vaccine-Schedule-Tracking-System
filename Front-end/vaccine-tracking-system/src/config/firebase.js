// src/firebase-config.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase config
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADx99bMyqn8R7kzas59S9ext3r9eh6WSk",
  authDomain: "vaccine-b5359.firebaseapp.com",
  projectId: "vaccine-b5359",
  storageBucket: "vaccine-b5359.firebasestorage.app",
  messagingSenderId: "509110460751",
  appId: "1:509110460751:web:a1f2613804f87b5728653a",
  measurementId: "G-EKNEYCSF7Y",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Lấy đối tượng auth để xác thực người dùng
const auth = getAuth(app);

// Tạo provider cho Google Sign-In
const provider = new GoogleAuthProvider();

export { auth, provider };
