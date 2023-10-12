import { NavDropdown, Navbar, Nav, Modal, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect, useContext } from "react";
import Login from "../auth_components/Login"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import PasswordReset from "../auth_components/PasswordReset"
import Signup from "../auth_components/Signup"
import { ModalContext, ModalState } from "../contexts/ModalContext"

export const Header = () => {
  const [message, setMessage] = useState("")
  const { currentUser, logout } = useAuth() as any
  const [userData, setUserData] = useState(null) as any
  const history = useHistory()
  const [modalState, setModalState] = useContext(ModalContext);

  const showModal = modalState !== ModalState.HIDDEN
  const showLogin = () => setModalState(ModalState.LOGIN);
  const showReset = () => setModalState(ModalState.RESET);
  const showSignup = () => setModalState(ModalState.SIGNUP);
  const closeLogin = () => setModalState(ModalState.HIDDEN);

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
        setMessage("Logged out successfully.")
        console.log(message)
        history.push("/")
    } catch {
      setMessage("Failed to log out.")
      console.log(message)
    }
  }

  // modal
  function chooseModalComponent() {
    if (modalState === ModalState.LOGIN) {
      return <Login onResetClicked={ showReset } onSignupClicked={ showSignup } />
    } else if (modalState === ModalState.RESET) {
      return <PasswordReset onLoginClicked={ showLogin } onSignupClicked={ showSignup } />
    } else if (modalState === ModalState.SIGNUP) {
      return <Signup onLoginClicked={ showLogin }/>
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
            <LinkContainer to='/resources'>
              <Nav.Link>Resources</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/about'>
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/contact-us'>
              <Nav.Link>Contact</Nav.Link>
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
              <Nav.Link onClick={showLogin}>Saved</Nav.Link>
              <Nav.Link onClick={showLogin}>Log in / Sign up</Nav.Link>
              <Modal show={showModal} onHide={closeLogin}>
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
