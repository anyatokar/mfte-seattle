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
