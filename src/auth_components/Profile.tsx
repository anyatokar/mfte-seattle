import React, { useState } from "react"
import { Card, Button, Alert, Modal, Nav } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { render } from "@testing-library/react"
import Login from "./Login"

export default function Dashboard() {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("./")
    } catch {
      setError("Failed to log out")
    }
  }

  // Login
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [key, setKey] = useState('Profile');

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
