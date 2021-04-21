import React, { useState, useEffect } from "react"
import { Card, Button, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Login from "./Login"
import firebase from "../db/firebase";
import { Container, Row, Col } from 'react-bootstrap';

export default function Dashboard() {
  const { currentUser } = useAuth() as any

  // Login
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

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
    <>
      {currentUser && userData
        ? (
        <>
          <Container>
            <Row>
              <Col md={5} lg={6}>
                <Card className="saved-homes-profile-update-card">
                  <Card.Body>
                    <Card.Text>
                      <strong>Name: </strong>{userData.name}
                    </Card.Text>
                    <Card.Text>
                      <strong>Email: </strong>{currentUser.email}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </>
        ) : (
        <>
          {/* <Button onClick={handleShowLogin} variant="info">Saved Homes</Button>
            <Modal show={showLogin} onHide={handleCloseLogin}>
              <Login />
            </Modal> */}
        </>
        )
      }
    </>
  )
}
