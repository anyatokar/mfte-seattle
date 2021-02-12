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
        <Card style={{ width: '18rem' }}>
          <Card.Header>
            <Nav variant="tabs" defaultActiveKey="#first">
              <Nav.Item>
                <Nav.Link href="#first">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="#link">Update Profile</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text id="#first">
              <strong>Email: </strong>{currentUser.email}
            </Card.Text>
            {/* <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
          </Card>

          <Card>
          <Card.Body>
            <Card.Title></Card.Title>
            <Card.Text>
              <strong>Emafil: </strong>{currentUser.email}
            </Card.Text>
            {/* <Button variant="primary">Go somewhere</Button> */}
          </Card.Body>
          </Card>
        </Card>
          {/* <Card style={{ width: '18rem' }}> */}
            {/* <div className="container saved-homes-header"> */}
              {/* <h1 className="display-6">Profile</h1> */}
              {/* <p className="lead"></p> */}
              {/* <hr className="my-4"></hr> */}
            {/* </div> */}
            {/* <Card.Header>Profile</Card.Header>
            <Card.Body>

            <Card.Text>
              {error && <Alert variant="danger">{error}</Alert>}
              <strong>Email:</strong> {currentUser.email}
              <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                Update Profile
              </Link>
              </Card.Text>
              <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
            </Card.Body>
          </Card> */}
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
