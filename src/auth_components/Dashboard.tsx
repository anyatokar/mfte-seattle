import React, { useState } from "react"
import { Card, Button, Alert, Modal, Nav, Tab, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { render } from "@testing-library/react"
import Login from "./Login"
import UpdateProfile from "./UpdateProfile"
import Profile from "./Profile"

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
        ? (
        <>
        <Tab.Container id="sidebar" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first" className="tab">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second" className="tab">Update Profile</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="third" className="tab">Tab 3</Nav.Link>
              </Nav.Item> */}
            </Nav>
            </Col>
            <Col sm={9} className="profile-email">
            <Tab.Content>
              <Tab.Pane eventKey="first">
                {/* <h3>Profile</h3> */}
                <Profile />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
              {/* <h3 className="display-6">Update</h3> */}
              <UpdateProfile />
              </Tab.Pane>
            </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>

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
