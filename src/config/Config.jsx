// Імпортуємо модулі Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase конфігурація
const firebaseConfig = {
    apiKey: "AIzaSyDDPw3WxAWmh_RPGZLWlzgGnbQRY877688",
    authDomain: "store-project-8316f.firebaseapp.com",
    projectId: "store-project-8316f",
    storageBucket: "store-project-8316f.firebasestorage.app",
    messagingSenderId: "516884703046",
    appId: "1:516884703046:web:d72b27ec15cb968e19a747",
    measurementId: "G-SC8CB607TF",
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Експорт сервісів Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
