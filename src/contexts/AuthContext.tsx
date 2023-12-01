import { useContext, useState, useEffect, createContext } from "react";
import IProps from "../interfaces/IProps";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: IProps) {
  const [currentUser, setCurrentUser] = useState() as any;
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string, name: string) {
    return createUserWithEmailAndPassword(getAuth(), email, password).then(
      (cred) => {
        if (cred.user) {
          updateProfile(cred.user, { displayName: name });
        }
      }
    );
  }

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(getAuth(), email, password);
  }

  function logout() {
    return signOut(getAuth());
  }

  function resetPassword(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
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
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
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
