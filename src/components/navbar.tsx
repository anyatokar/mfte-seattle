import { NavDropdown, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
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

  // generic onClick and redirect
  function onClick(e: any) {
    e.preventDefault()
    history.push(e.target.value)
  };

  // Dashboard onClick and redirect
  function onClickDashboard(e: any) {
    e.preventDefault()
    history.push("./dashboard")
  };

  // Update Profile onClick and redirect
  // function onClickUpdateProfile(e: any) {
  //   e.preventDefault()
  //   history.push("./update-profile")
  // };

  // Logout
  async function handleLogout() {
    setError("")
    try {
      await logout()
      history.push("/login")
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
            <Nav.Link>Buildings</Nav.Link>
          </LinkContainer>
          <NavDropdown title="About" id="basic-nav-dropdown">
            <NavDropdown.Item>
              <LinkContainer to='/about-mfte'>
                <Nav.Link>MFTE</Nav.Link>
              </LinkContainer>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <LinkContainer to='/about-app'>
                <Nav.Link>This Website</Nav.Link>
              </LinkContainer>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

        <ButtonGroup >
          { currentUser ? (
          <>
            <Button onClick={onClick} value="./saved-homes" variant="warning">Saved</Button>
            {/* <Button onClick={onClick} value="./saved-searches" variant="warning">Saved Searches</Button> */}
            <DropdownButton 
              menuAlign="right"
              as={ButtonGroup} 
              title={"Logged in as: ".concat(`${currentUser.email}`)}
              id="bg-nested-dropdown" 
              variant="warning">
              <Dropdown.Item onClick={onClickDashboard} eventKey="dashboard">Dashboard</Dropdown.Item>
              {/* <Dropdown.Item onClick={onClickUpdateProfile} value="./UpdateProfile" eventKey="2">Update Profile</Dropdown.Item> */}
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} eventKey="logout">Logout</Dropdown.Item>
            </DropdownButton>
          </>
          ) : (
          <>
            <Button onClick={handleShowLogin} variant="info">Saved</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal>
            {/* <Button onClick={handleShowLogin}  variant="info">Saved Searches</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal> */}
            <Button onClick={handleShowLogin} variant="info">Log in / Sign up</Button>
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