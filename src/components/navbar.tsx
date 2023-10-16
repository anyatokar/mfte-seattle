import { NavDropdown, Navbar, Nav, Modal, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect, useContext } from "react";
import Login from "../auth_components/Login";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import PasswordReset from "../auth_components/PasswordReset";
import Signup from "../auth_components/Signup";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import mftelogo from '../assets/images/mftelogo23.svg';

export const Header = () => {
  const [message, setMessage] = useState("")
  const { currentUser, logout } = useAuth() as any
  const [userData, setUserData] = useState(null) as any
  const history = useHistory()
  const [modalState, setModalState] = useContext(ModalContext);

  const showModal = modalState !== ModalState.HIDDEN
  const showLogin = () => setModalState(ModalState.LOGIN);
  const showLoginSavedBuildings = () => setModalState(ModalState.LOGIN_SAVED_BUILDINGS);
  const showReset = () => setModalState(ModalState.RESET);
  const showSignup = () => setModalState(ModalState.SIGNUP);
  const closeLogin = () => setModalState(ModalState.HIDDEN);

  const afterLogin = () =>  history.push("./saved-homes");

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
  function onClickDashboard(event: any) {
    event.preventDefault()
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
      return <Login onResetClicked={ showReset } onSignupClicked={ showSignup }/>
    } else if (modalState === ModalState.LOGIN_SAVED_BUILDINGS) {
      return <Login onResetClicked={ showReset } onSignupClicked={ showSignup } afterLogin={ afterLogin }/>
    } else if (modalState === ModalState.RESET) {
      return <PasswordReset onLoginClicked={ showLogin } onSignupClicked={ showSignup } />
    } else if (modalState === ModalState.SIGNUP) {
      return <Signup onLoginClicked={ showLogin }/>
    }
  }

  return (
    <div>
      <Navbar fixed="top" variant="light" collapseOnSelect expand="md" className="mb-3">
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src={mftelogo}
              width="80"
              height="80"
              className="d-inline-block align-top"
              alt="MFTE Seattle website logo: a teal map pin with a house on it"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <LinkContainer to='/buildings'>
              <Nav.Link>All Buildings</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/resources'>
              <Nav.Link>Resources</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
            <LinkContainer to='/about'>
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/contact-us'>
              <Nav.Link>Contact</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
          </Nav>
          { currentUser ? (
          <>
            <Nav>
              <NavDropdown
                id="dropdown-menu-align-right"
                title= {userData ? `Hi ${userData.name}!` : ''}
              >
                <Dropdown.Item onClick={onClickDashboard} eventKey="dashboard">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} eventKey="logout">Logout</Dropdown.Item>
              </NavDropdown>
              <LinkContainer to='./saved-homes'>
                <Nav.Link>Saved Buildings</Nav.Link>
              </LinkContainer>
            </Nav>
          </>
          ) : (
          <>
            <Nav>
              <Nav.Link onClick={showLogin}>Log In / Sign Up</Nav.Link>
              <Nav.Link onClick={showLoginSavedBuildings}>Saved Buildings</Nav.Link>
              <Modal show={showModal} onHide={closeLogin}>
                {chooseModalComponent()}
              </Modal>
            </Nav>
          </>
          )}
        <Dropdown.Divider />
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
