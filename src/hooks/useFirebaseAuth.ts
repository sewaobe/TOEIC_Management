// src/hooks/useFirebaseAuth.ts
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../services/firebaseConfig";

export const signInWithGoogle = async (): Promise<UserCredential | null> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result;
};
