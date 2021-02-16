import React, { useState } from "react"
import { Card, Button, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Login from "./Login"

export default function Dashboard() {
  const { currentUser } = useAuth() as any

  // Login
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  return (
    <>
      {currentUser
        ? (
        <>
          <Card style={{ width: '25rem' }}>
            <Card.Body>
              <Card.Title></Card.Title>
              <Card.Text>
                <strong>Email: </strong>{currentUser.email}
              </Card.Text>
            </Card.Body>
          </Card>
        </>
        ) : (
        <>
          <Button onClick={handleShowLogin} variant="info">Saved Homes</Button>
            <Modal show={showLogin} onHide={handleCloseLogin}>
              <Login />
            </Modal>
        </>
        )
      }
    </>
  )
}
