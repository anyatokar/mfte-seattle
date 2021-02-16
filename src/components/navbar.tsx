import { NavDropdown, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect } from "react";
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

export const Header = () => {

  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [message, setMessage] = useState("")
  const { currentUser, logout } = useAuth() as any
  const [userData, setUserData] = useState(null)as any
  const history = useHistory()

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

  // Logout
  async function handleLogout() {
    setMessage("")
    setShowLogin(false)
    try {
      await logout()
        setMessage("Logged out successfully")
        history.push("/")
    } catch {
      setMessage("Failed to log out")
    }
  }

  return (
    <div>
      <Navbar variant="light">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              MFTE Simple
            </Navbar.Brand>
          </LinkContainer>
          <LinkContainer to='/buildings'>
            <Nav.Link>Buildings</Nav.Link>
          </LinkContainer>
          <NavDropdown title="About" id="basic-nav-dropdown">
            <NavDropdown.Item>
              <LinkContainer to="about-mfte">
                <Nav.Link>MFTE</Nav.Link>
              </LinkContainer>
            </NavDropdown.Item>
          <NavDropdown.Item>
            <LinkContainer to="/about-app">
              <Nav.Link>This Website</Nav.Link>
              </LinkContainer>
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

        <ButtonGroup >
          { currentUser ? (
          <>
            <Button onClick={onClick} value="./saved-homes" variant="info">Saved</Button>
            <DropdownButton 
              menuAlign="right"
              as={ButtonGroup} 
              title= {userData ? `Hi, ${userData.name}` : ''}
              id="bg-nested-dropdown" 
              variant="info">
              <Dropdown.Item onClick={onClickDashboard} eventKey="dashboard">Dashboard</Dropdown.Item>
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