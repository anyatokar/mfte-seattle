import { Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Signup from '../auth_components/Signup';

import { Component, FunctionComponent, useState } from "react";
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export const Header = () => {

  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

  function onClick(e: any) {
    e.preventDefault()
    history.push(e.target.value)
  };

  async function handleLogout() {
    setError("")

    try {
      await logout()
      // history.push("/login")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <div>
      <Navbar variant="light">
        <Nav className="mr-auto">
          <LinkContainer to='/'>
            <Nav.Link><strong>MFTE Simple</strong></Nav.Link>
          </LinkContainer>
          <LinkContainer to='/buildings'>
            <Nav.Link>All Buildings</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/about-mfte'>
            <Nav.Link>About MFTE</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/about-app'>
            <Nav.Link>About this app</Nav.Link>
          </LinkContainer>
        </Nav>

        <ButtonGroup >
          { currentUser ? (
          <>
            <Button onClick={onClick} value="./saved-homes" variant="warning">Saved Homes</Button>
            <Button onClick={onClick} value="./saved-searches" variant="warning">Saved Searches</Button>
            <DropdownButton as={ButtonGroup} title={`Logged in as: ${currentUser.email}`} id="bg-nested-dropdown" variant="warning">
              <Dropdown.Item href="./dashboard" eventKey="1">Dashboard</Dropdown.Item>
              <Dropdown.Item href="./update-profile" eventKey="2">Update Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} eventKey="3">Logout</Dropdown.Item>
            </DropdownButton>
          </>
          ) : (
          <>
            <Button onClick={handleShowLogin} variant="info">Saved Homes</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal>
            <Button onClick={handleShowLogin}  variant="info">Saved Searches</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal>
            <Button onClick={handleShowLogin} variant="info">Log in or Sign up</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal>
          </>
          )}
        </ButtonGroup>
      </Navbar>
    </div>
  )
}