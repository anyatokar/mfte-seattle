import { Container, Image, Navbar, Nav, Modal, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import firebase from "../db/firebase";

import { useState, useEffect, useContext, useCallback } from "react";
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
  const closeLogin = useCallback(() => setModalState(ModalState.HIDDEN), [setModalState]);

  const afterLogin = () =>  history.push("./saved-homes");

  useEffect(() => {
    closeLogin()
  }, [currentUser, closeLogin])

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
    } else if (modalState === ModalState.LOGIN_SAVED_BUILDINGS) {
      return <Login onResetClicked={ showReset } onSignupClicked={ showSignup } afterLogin={ afterLogin } />
    } else if (modalState === ModalState.RESET) {
      return <PasswordReset onLoginClicked={ showLogin } onSignupClicked={ showSignup } />
    } else if (modalState === ModalState.SIGNUP) {
      return <Signup onLoginClicked={ showLogin } />
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="p-0">
      <Container fluid>
        <LinkContainer to='/'>
          <Navbar.Brand>
            <Image
              src={mftelogo}
              height="80"
              width="80"
              alt="MFTE Seattle website logo: a teal map pin with a house on it"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <LinkContainer to='/buildings'>
              <Nav.Link active={false}>MFTE Map</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/resources'>
              <Nav.Link active={false}>Resources</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
            <LinkContainer to='/about'>
              <Nav.Link active={false} >About</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/contact-us'>
              <Nav.Link active={false}>Contact</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
          </Nav>
          { currentUser ? (
          <Nav>
            <Navbar.Text>{userData ? `Hi, ${userData.name}!` : ''}</Navbar.Text>
            <LinkContainer to='/dashboard'>
              <Nav.Link active={false}>Profile</Nav.Link>
            </LinkContainer>
            <LinkContainer to='/saved-homes'>
              <Nav.Link active={false}>Saved</Nav.Link>
            </LinkContainer>
            <Nav.Link className="logout" active={false} onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
          ) : (
          <Nav>
            <Nav.Link active={false} onClick={showLoginSavedBuildings}>Saved</Nav.Link>
            <Nav.Link active={false} onClick={showLogin}>Log In / Sign Up</Nav.Link>
            <Modal show={showModal} onHide={closeLogin}>
              {chooseModalComponent()}
            </Modal>
          </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
