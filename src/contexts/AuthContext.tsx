import { useContext, useState, useEffect, createContext } from "react";
import { accountTypeEnum } from "../types/enumTypes";

import IProps from "../interfaces/IProps";
import { SignupAuthDataType } from "../interfaces/IUser";

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
  User,
} from "firebase/auth";
import {
  getAccountTypeFirestore,
  signupFirestore,
} from "../utils/firestoreUtils";

interface AuthContextProps {
  currentUser: User | null;
  accountType: accountTypeEnum | null;
  login: (email: string, password: string) => Promise<void>;
  signupAuth: (signupAuthData: SignupAuthDataType) => Promise<void>;
  logout: () => Promise<void>;
  resetPasswordAuth: (email: string) => Promise<void>;
  updateDisplayNameAuth: (displayName: string) => Promise<void> | undefined;
  updateEmailAuth: (email: string) => Promise<void> | undefined;
  updatePasswordAuth: (password: string) => Promise<void> | undefined;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("useAuth must be used within an AuthProvider");
    throw new Error("Something went wrong.");
  }
  return context;
}

const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accountType, setAccountType] = useState<accountTypeEnum | null>(null);
  const [loading, setLoading] = useState(true);

  async function signupAuth(signupAuthData: SignupAuthDataType) {
    const { email, password, name } = signupAuthData;

    const cred = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });

      await signupFirestore({ ...signupAuthData, uid: cred.user.uid });
    }
  }

  async function login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(getAuth(), email, password);
  }

  function logout() {
    return signOut(getAuth());
  }

  function resetPasswordAuth(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  function updateDisplayNameAuth(displayName: string) {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      return updateProfile(currentUser, { displayName: displayName });
    }
  }

  function updateEmailAuth(email: string) {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      return updateEmail(currentUser, email);
    }
  }

  function updatePasswordAuth(password: string) {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      return updatePassword(currentUser, password);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        const accountType = await getAccountTypeFirestore(currentUser.uid);
        setAccountType(accountType);
      } else {
        setAccountType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextProps = {
    currentUser,
    accountType,
    login,
    signupAuth: signupAuth,
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
};

export default AuthProvider;
