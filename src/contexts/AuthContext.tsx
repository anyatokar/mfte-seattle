import { useContext, useState, useEffect, createContext } from "react";
import firebase, { auth } from "../db/firebase";
import IProps from "../interfaces/IProps";
import { signupFirestore } from "../utils/firestoreUtils";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: IProps) {
  const [currentUser, setCurrentUser] = useState() as any;
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        if (cred.user) {
          cred.user.updateProfile({ displayName: name });
          signupFirestore(cred.user.uid, cred.user.email, name);
        }
      });
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password).then((cred) => {
      if (cred.user) {
        // Backfill missing data for existing account.
        signupFirestore(cred.user.uid, cred.user.email, cred.user.displayName);
      }
    });
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateDisplayName(displayName: string) {
    return currentUser.updateProfile({ displayName: displayName });
  }

  function updateEmail(email: string) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateDisplayName,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
