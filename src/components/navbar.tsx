import { NavDropdown, Navbar, Nav, Modal, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect } from "react";
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import PasswordReset from "../auth_components/PasswordReset"

export const Header = () => {
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const [message, setMessage] = useState("")
  const { currentUser, logout } = useAuth() as any
  const [userData, setUserData] = useState(null) as any
  const history = useHistory()
  const [modalState, setModalState] = useState("Login")

  useEffect(() => {
    setShowLogin(false)
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
    setShowLogin(false)
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
      <Navbar variant="light" collapseOnSelect expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand className="font-weight-bold text-muted">
            MFTE Seattle
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav activeKey={window.location.pathname} className="mr-auto">
            <LinkContainer to='/buildings'>
              <Nav.Link>Buildings</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/about'>
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
          </Nav>
          { currentUser ? (
          <>
            <Nav>
              <LinkContainer to='./saved-homes'>
                <Nav.Link>Saved</Nav.Link>
              </LinkContainer>
              <NavDropdown
                id="dropdown-menu-align-right"
                title= {userData ? `Hello, ${userData.name}` : ''}
              >
                <Dropdown.Item onClick={onClickDashboard} eventKey="dashboard">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} eventKey="logout">Logout</Dropdown.Item>
              </NavDropdown>
            </Nav>
          </>
          ) : (
          <>
            <Nav>
              <Nav.Link onClick={handleShowLogin}>Saved</Nav.Link>
              <Nav.Link onClick={handleShowLogin}>Log in / Sign up</Nav.Link>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                {chooseModalComponent()}
              </Modal>
            </Nav>
          </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}