import { NavDropdown, Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect } from "react";
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import PasswordReset from "../auth_components/PasswordReset"

export const Header = () => {
  const [shouldShowLogin, setShowLogin] = useState(false);

  const [message, setMessage] = useState("")
  const { currentUser, logout } = useAuth() as any
  const [userData, setUserData] = useState(null) as any
  const history = useHistory()
  const [modalState, setModalState] = useState("Login")
  const showLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  useEffect(() => {
    closeLogin()
  }, [currentUser])

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
    closeLogin()
    try {
      await logout()
        setMessage("Logged out successfully")
        history.push("/")
    } catch {
      setMessage("Failed to log out")
    }
  }

  // modal
  function chooseModalComponent() {
    if (modalState === "Login") {
      return(<Login />)
    } else if (modalState === "Reset") {
      return(<PasswordReset />)
    }
  }

  return (
    <div>
      <Navbar variant="light">
        <Nav className="mr-auto">
          <LinkContainer to="/">
            <Navbar.Brand className="font-weight-bold text-muted">
              MFTE Seattle
            </Navbar.Brand>
          </LinkContainer>
          <LinkContainer to='/buildings'>
            <Nav.Link>Buildings</Nav.Link>
          </LinkContainer>
          <LinkContainer to='/about'>
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
        </Nav>

        <ButtonGroup >
          { currentUser ? (
          <>
            <Button onClick={onClick} value="./saved-homes" variant="info">Saved</Button>
            <DropdownButton 
              menuAlign="right"
              id="dropdown-menu-align-right"
              as={ButtonGroup} 
              title= {userData ? `Hi, ${userData.name}` : ''}
              variant="info"
            >
              <Dropdown.Item onClick={onClickDashboard} eventKey="dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} eventKey="logout">Logout</Dropdown.Item>
            </DropdownButton>
          </>
          ) : (
          <>
            <Button onClick={showLogin} variant="info">Saved</Button>
            <Button onClick={showLogin} variant="info">Log in / Sign up</Button>
          </>
          )}
        </ButtonGroup>
        <Modal show={shouldShowLogin} onHide={closeLogin}>
          {chooseModalComponent()}
        </Modal>
      </Navbar>
    </div>
  )
}