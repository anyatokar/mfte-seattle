
import { useState, useEffect, useContext, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import mftelogo from "../assets/images/mftelogo23.svg";

import { ModalContext, ModalState } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";

import Login from "../auth_components/Login";
import PasswordReset from "../auth_components/PasswordReset";
import Signup from "../auth_components/Signup";

import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export const Header = () => {
  const [message, setMessage] = useState("");
  const { currentUser, logout } = useAuth() as any;
  const history = useHistory();
  const [modalState, setModalState] = useContext(ModalContext);

  const showModal = modalState !== ModalState.HIDDEN;
  const showLogin = () => setModalState(ModalState.LOGIN);
  const showLoginSavedBuildings = () =>
    setModalState(ModalState.LOGIN_SAVED_BUILDINGS);
  const showReset = () => setModalState(ModalState.RESET);
  const showSignup = () => setModalState(ModalState.SIGNUP);
  const closeLogin = useCallback(
    () => setModalState(ModalState.HIDDEN),
    [setModalState]
  );

  const afterLogin = () => history.push("./saved-buildings");

  useEffect(() => {
    closeLogin();
  }, [currentUser, closeLogin]);

  // Logout
  async function handleLogout() {
    setMessage("");
    closeLogin();
    try {
      await logout();
      setMessage("Logged out successfully.");
      console.log(message);
      history.push("/");
    } catch {
      setMessage("Failed to log out.");
      console.log(message);
    }
  }

  // Modal
  function chooseModalComponent() {
    if (modalState === ModalState.LOGIN) {
      return <Login onResetClicked={showReset} onSignupClicked={showSignup} />;
    } else if (modalState === ModalState.LOGIN_SAVED_BUILDINGS) {
      return (
        <Login
          onResetClicked={showReset}
          onSignupClicked={showSignup}
          afterLogin={afterLogin}
        />
      );
    } else if (modalState === ModalState.RESET) {
      return (
        <PasswordReset
          onLoginClicked={showLogin}
          onSignupClicked={showSignup}
        />
      );
    } else if (modalState === ModalState.SIGNUP) {
      return <Signup onLoginClicked={showLogin} />;
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="p-0">
      <Container fluid>
        <LinkContainer to="/">
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
            <LinkContainer to="/all-buildings">
              <Nav.Link active={false}>MFTE Map</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/resources">
              <Nav.Link active={false}>Resources</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
            <LinkContainer to="/about">
              <Nav.Link active={false}>About</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/contact-us">
              <Nav.Link active={false}>Contact</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
          </Nav>
          {currentUser ? (
            <Nav>
              <Navbar.Text className="mr-lg-4 font-italic">
                {currentUser.displayName && `Hi, ${currentUser.displayName}!`}
              </Navbar.Text>
              <LinkContainer to="/manage-profile">
                <Nav.Link active={false}>Profile</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/saved-buildings">
                <Nav.Link active={false}>Saved</Nav.Link>
              </LinkContainer>
              <Nav.Link
                className="logout"
                active={false}
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link active={false} onClick={showLoginSavedBuildings}>
                Saved
              </Nav.Link>
              <Nav.Link active={false} onClick={showLogin}>
                Log In / Sign Up
              </Nav.Link>
              <Modal show={showModal} onHide={closeLogin}>
                {chooseModalComponent()}
              </Modal>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
