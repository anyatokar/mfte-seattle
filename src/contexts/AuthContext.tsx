import { useContext, useState, useEffect, createContext } from "react";
import IProps from "../interfaces/IProps";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { getNameFirestore, signupFirestore } from "../utils/firestoreUtils";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: IProps) {
  const [currentUser, setCurrentUser] = useState() as any;
  const [loading, setLoading] = useState(true);

  async function signupAuth(email: string, password: string, name: string) {
    return createUserWithEmailAndPassword(getAuth(), email, password).then(
      (cred) => {
        if (cred.user) {
          updateProfile(cred.user, { displayName: name });
          signupFirestore(cred.user.uid, cred.user.email, name);
        }
      }
    );
  }

  async function login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(getAuth(), email, password);

    if (cred.user) {
      const nameInFirestore = await getNameFirestore(cred.user.uid);

      // Backfill user displayName from Firestore to Auth
      // only if the displayName doesn't already exist in Auth.
      if (nameInFirestore && !cred.user.displayName) {
        updateProfile(cred.user, { displayName: nameInFirestore });
      }

      // Backfill missing data from Auth to Firestore.
      signupFirestore(cred.user.uid, cred.user.email, cred.user.displayName);
    }
  }

  function logout() {
    return signOut(getAuth());
  }

  function resetPasswordAuth(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  function updateDisplayNameAuth(displayName: string) {
    const user = getAuth().currentUser;
    if (user) {
      return updateProfile(user, { displayName: displayName });
    }
  }

  function updateEmailAuth(email: string) {
    const user = getAuth().currentUser;
    if (user) {
      return updateEmail(currentUser, email);
    }
  }

  function updatePasswordAuth(password: string) {
    const user = getAuth().currentUser;
    if (user) {
      return updatePassword(currentUser, password);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signupAuth,
    logout,
    resetPasswordAuth,
    updateDisplayNameAuth,
    updateEmailAuth,
    updatePasswordAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
