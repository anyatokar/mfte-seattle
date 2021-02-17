import React, { useState, useEffect } from "react"
import { Button, Modal, Nav, Tab, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Login from "./Login"
import UpdateProfile from "./UpdateProfile"
import Profile from "./Profile"

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
          <Tab.Container id="sidebar" defaultActiveKey="profile">
            <Row>
              <Col sm={2}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="tab">Profile</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="update" className="tab">Update Profile</Nav.Link>
                </Nav.Item>
              </Nav>
              </Col>
              <Col sm={10} className="profile-email">
                <Tab.Content>
                  <Tab.Pane eventKey="profile">
                    <Profile/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="update">
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
