import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { auth } from '../Firebase';
import { doc, setDoc,getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create user document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || additionalData.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      ...additionalData
    }, { merge: true });
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError('');
      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      setError('Failed to sign in: ' + error.message);
      // console.error("Email sign in error:", error);
      throw error;
    }
  };

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with the display name
      await updateProfile(result.user, {
        displayName: displayName
      });
      
      // Create user document
      await createUserDocument(result.user, { displayName });
      
      // Refresh the user to get updated profile
      await result.user.reload();
      return result.user;
    } catch (error) {
      setError('Failed to create account: ' + error.message);
      // console.error("Email sign up error:", error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setError('');
      await setPersistence(auth, browserLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      
      // Create user document
      await createUserDocument(result.user);
      
      return result.user;
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        setError('Login popup was closed');
      } else if (error.message.includes('Cross-Origin-Opener-Policy')) {
        setError('Please try again');
      } else {
        setError('Failed to sign in with Google: ' + error.message);
      }
      // console.error("Google sign in error:", error);
      throw error;
    }
  };

  // Log out function
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError('Failed to log out: ' + error.message);
      // console.error("Logout error:", error);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserDocument(user);
        // Fetch cart items for the user
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            ...user,
            cartItems: userDoc.data().cartItems || []
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userId: currentUser?.uid,
    login,
    signup,
    signInWithGoogle,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};