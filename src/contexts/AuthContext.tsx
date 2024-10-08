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
import {
  getAccountTypeFirestore,
  getNameFirestore,
  signupFirestore,
} from "../utils/firestoreUtils";
import { accountTypeEnum } from "../types/enumTypes";

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

interface IBaseSignupAuthData {
  email: string;
  name: string;
  uid: string;
  password: string;
}

interface ICompanySignupAuthData extends IBaseSignupAuthData {
  isCompany: true; // 'isCompany' must be true for company accounts
  companyName: string;
  jobTitle: string;
}

interface IUserSignupAuthData extends IBaseSignupAuthData {
  isCompany: false; // 'isCompany' must be false for regular users
}

export type SignupAuthDataType = ICompanySignupAuthData | IUserSignupAuthData;

const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accountType, setaccountType] = useState<accountTypeEnum | null>(
    accountTypeEnum.LURKER
  );
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
    const cred = await signInWithEmailAndPassword(getAuth(), email, password);

    if (cred.user) {
      // Backfill user displayName from Firestore to Auth
      // only if the displayName doesn't already exist in Auth.
      if (!cred.user.displayName) {
        const nameInFirestore = await getNameFirestore(cred.user.uid);
        if (nameInFirestore) {
          updateProfile(cred.user, { displayName: nameInFirestore });
          //TODO: temp logging, remove.
          console.log("backfill 1");
        }

        // Backfill missing data from Auth to Firestore.
        if (cred.user.email && cred.user.displayName && nameInFirestore) {
          signupFirestore({
            uid: cred.user.uid,
            email: cred.user.email,
            name: cred.user.displayName,
            isCompany: false,
            password: "", // This won't be used
          });
          //TODO: temp logging, remove.
          console.log("backfill 2");
        }
      }
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
    const unsubscribe = onAuthStateChanged(getAuth(), async (currentUser) => {
      setCurrentUser(currentUser);
      if (currentUser) {
        const accountType = await getAccountTypeFirestore(currentUser.uid);
        console.log(accountType);
        setaccountType(accountType);
      } else {
        setaccountType(accountTypeEnum.LURKER); // Reset state if no user is signed in
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
