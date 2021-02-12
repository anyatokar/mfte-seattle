import React, { useState } from "react"
import { Card, Button, Alert, Modal } from "react-bootstrap"
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

  return (
    <>
      {currentUser
        ? (<div>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <strong>Email:</strong> {currentUser.email}
            <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
              Update Profile
            </Link>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Button variant="link" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
        </div>
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
