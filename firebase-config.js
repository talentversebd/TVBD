// Firebase Config & Initialize
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1VAUyNGYE7XpgLRN6-xeAI5QMjN-Q_Lk",
  authDomain: "talentverse-bd.firebaseapp.com",
  projectId: "talentverse-bd",
  storageBucket: "talentverse-bd.firebasestorage.app",
  messagingSenderId: "926824145286",
  appId: "1:926824145286:web:1d3a8558aeefe42c4f4c07"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export globally
window.firebaseDB = db;
window.firebaseAuth = auth;
window.firebaseFunctions = {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc, getDoc, query, orderBy, onSnapshot,
  signInWithEmailAndPassword, signOut, onAuthStateChanged
};

// ImgBB API Key
window.IMGBB_KEY = "b374ae6a3edcf12a90a5b7be9ec39f50";

// EmailJS Config
window.EMAILJS_CONFIG = {
  serviceId: "service_5d6f3df",
  templateId: "template_gylaytb",
  publicKey: "4iIwmHI85Rhylf8Sx"
};

console.log("🔥 Firebase Initialized Successfully!");
