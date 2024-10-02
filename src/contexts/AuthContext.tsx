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
  User,
} from "firebase/auth";
import { getNameFirestore, signupFirestore } from "../utils/firestoreUtils";

export interface ISignupAuthData {
  email: string;
  name: string;
  password: string;
  isCompany: boolean;
  companyName?: string;
  jobTitle?: string;
  uid?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signupAuth: (signupAuthData: ISignupAuthData) => Promise<void>;
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
  const [loading, setLoading] = useState(true);

  async function signupAuth(signupAuthData: ISignupAuthData) {
    const { email, password, name, isCompany, companyName, jobTitle } =
      signupAuthData;

    return createUserWithEmailAndPassword(getAuth(), email, password).then(
      (cred) => {
        if (cred.user) {
          updateProfile(cred.user, { displayName: name });

          signupAuthData.uid = cred.user.uid;
          signupFirestore(signupAuthData);
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
      // signupFirestore(
      //   cred.user.uid,
      //   cred.user.email,
      //   cred.user.displayName,
      //   false
      // );
    }
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
    const unsubscribe = onAuthStateChanged(getAuth(), (currentUser) => {
      setCurrentUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    currentUser,
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
