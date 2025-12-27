// app/config.js/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBXChtYr4A25f-7GukWB-vukPkmtvKUwNA",
  authDomain: "dhub-customer.firebaseapp.com",
  projectId: "dhub-customer",
  storageBucket: "dhub-customer.firebasestorage.app",
  messagingSenderId: "765532412552",
  appId: "1:765532412552:web:b7cd1c824be1c580155d3d",
  measurementId: "G-BNCGCYR3MV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔥 Updated Google Provider Configuration
const googleProvider = new GoogleAuthProvider();

// Add these custom parameters to show logged-in accounts
googleProvider.setCustomParameters({
  prompt: 'select_account', // Force account selection screen
  // Optional: add these for better UX
  login_hint: '', // Empty to show all accounts
  access_type: 'online',
});

// Add required scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Sign in with Google Popup
export const signInWithGoogle = async () => {
  try {
    // 🔥 Use signInWithPopup (more reliable than redirect)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Get the ID Token
    const idToken = await user.getIdToken();
    
    console.log('✅ Google Sign-In Success');
    console.log('👤 User Details:', {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      emailVerified: user.emailVerified
    });
    console.log('🔑 ID Token:', idToken.substring(0, 50) + '...');
    
    return { user, idToken };
  } catch (error) {
    console.error('❌ Google Sign-In Error:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    throw error;
  }
};

export { auth };
