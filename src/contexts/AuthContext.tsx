import { useContext, useState, useEffect, createContext } from "react"
import { auth } from "../db/firebase"
import IProps from "../interfaces/IProps"
import firebase from "../db/firebase"

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children}: IProps) {
  const [currentUser, setCurrentUser] = useState() as any
  const [loading, setLoading] = useState(true)

  async function signup(email: string, password: string, name: string) {
    const user = firebase.auth().createUserWithEmailAndPassword(email, 
      password)
      .then(cred => {
        if (cred.user) {
          return firebase.firestore().collection('users').doc(cred.user.uid).set({
            email: cred.user.email,
            name: name
          })
        }
      })
    return { user }
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email: string) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email: string) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password: string) {
    return currentUser.updatePassword(password)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
