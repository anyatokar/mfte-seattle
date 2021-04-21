import { useState, useEffect } from "react"
import { Card } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import firebase from "../db/firebase";

export default function Profile() {
  const { currentUser } = useAuth() as any
  const [userData, setUserData] = useState(null) as any

  // get user Name
  useEffect(() => {
    if (currentUser) {
      const docRef = firebase.firestore().collection("users").doc(currentUser.uid)

      docRef.get().then((doc) => {
        if (doc.exists) {
          const data = doc.data()
          setUserData(data)
          console.log("Document data:", data);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    } else {(
      setUserData(null)
    )}
  }, [currentUser])

  return (
    currentUser && userData &&
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          <Card.Title></Card.Title>
          <Card.Text>
            <strong>Name: </strong>{userData.name}
          </Card.Text>
          <Card.Text>
            <strong>Email: </strong>{currentUser.email}
          </Card.Text>
        </Card.Body>
      </Card>
  );
}
