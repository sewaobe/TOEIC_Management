// src/hooks/useFirebaseAuth.ts
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../services/firebaseConfig";

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Google login failed:", error);
    return null;
  }
};
