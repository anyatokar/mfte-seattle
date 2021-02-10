import { Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import Signup from '../auth_components/Signup';

import { Component, FunctionComponent, useState } from "react";
import { render } from "react-dom";
import { useModal } from '../useModal';
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"

export const Header = () => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

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

        <ButtonGroup>
          { currentUser ? (
          <>
            <Button href="./saved-homes" variant="warning">Saved Homes</Button>
            <Button href="./saved-searches" variant="warning">Saved Searches</Button>
            <DropdownButton as={ButtonGroup} title={currentUser.email} id="bg-nested-dropdown" variant="warning">
              <Dropdown.Item href="./dashboard" eventKey="1">Dashboard</Dropdown.Item>
              <Dropdown.Item href="./update-profile" eventKey="2">Update Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout} eventKey="3">Logout</Dropdown.Item>
            </DropdownButton>
          </>
          ) : (
          <>
            <Button href="./saved-homes" variant="info">Saved Homes</Button>
            <Button href="./saved-searches" variant="info">Saved Searches</Button>
            <Button onClick={handleShow} variant="info">Log in or Sign up</Button>
            <Modal show={show} onHide={handleClose}>
              <Login />
            </Modal>
          </>
          )}
        </ButtonGroup>
      </Navbar>
    </div>
  )
}