import { useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import mftelogo from "../assets/images/mftelogo23.svg";

import { ModalContext, ModalState } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import { accountTypeEnum } from "../types/enumTypes";

import Login from "../auth_components/Login";
import PasswordReset from "../auth_components/PasswordReset";
import RepSignup from "../auth_components/RepSignup";
import Signup from "../auth_components/Signup";

import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Image from "react-bootstrap/Image";
import Modal from "react-bootstrap/Modal";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export const Header = () => {
  const { currentUser, logout, accountType } = useAuth();
  const navigate = useNavigate();
  const [modalState, setModalState] = useContext(ModalContext);

  const showModal = modalState !== ModalState.HIDDEN;
  const showLogin = () => setModalState(ModalState.LOGIN);
  const showLoginSavedBuildings = () =>
    setModalState(ModalState.LOGIN_SAVED_BUILDINGS);
  const showReset = () => setModalState(ModalState.RESET);
  const showSignup = () => setModalState(ModalState.SIGNUP);
  const showRepSignup = () => setModalState(ModalState.REP_SIGNUP);
  const closeLogin = useCallback(
    () => setModalState(ModalState.HIDDEN),
    [setModalState]
  );

  // TODO: this is broken due to the async nature of updating accountType
  const afterLoginSaved = () => navigate("./saved-buildings");
  const afterLoginManager = () => navigate("./manage-listings");

  useEffect(() => {
    closeLogin();
  }, [currentUser, closeLogin]);

  // Logout
  async function handleLogout() {
    closeLogin();
    try {
      await logout();
      let message = "Logged out successfully.";
      console.log(message);
      navigate("/");
    } catch (error: any) {
      let message = "Failed to log out.";
      console.error(`${message}. Error: ${error.message}`);
    }
  }

  // Modal
  function chooseModalComponent() {
    if (modalState === ModalState.LOGIN) {
      return (
        <Login
          onResetClicked={showReset}
          onSignupClicked={showSignup}
          onRepSignupClicked={showRepSignup}
        />
      );
    } else if (modalState === ModalState.LOGIN_SAVED_BUILDINGS) {
      return (
        <Login
          onResetClicked={showReset}
          onSignupClicked={showSignup}
          onRepSignupClicked={showRepSignup}
          afterLogin={afterLoginSaved}
        />
      );
    } else if (modalState === ModalState.RESET) {
      return (
        <PasswordReset
          onLoginClicked={showLogin}
          onSignupClicked={showSignup}
          onRepSignupClicked={showRepSignup}
        />
      );
    } else if (modalState === ModalState.SIGNUP) {
      return <Signup onLoginClicked={showLogin} />;
    } else if (modalState === ModalState.REP_SIGNUP) {
      return <RepSignup onLoginClicked={showLogin} />;
    } else if (modalState === ModalState.LOGIN_MANAGE_LISTINGS) {
      return (
        <Login
          onResetClicked={showReset}
          onSignupClicked={showSignup}
          onRepSignupClicked={showRepSignup}
          afterLogin={afterLoginManager}
        />
      );
    }
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="p-0">
      <Container fluid className="p-0">
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
          <Nav className="me-auto p-0">
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
            <LinkContainer to="/contact">
              <Nav.Link active={false}>Contact</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/for-managers">
              <Nav.Link active={false}>For Property Managers</Nav.Link>
            </LinkContainer>
            <Dropdown.Divider />
          </Nav>
          {currentUser ? (
            <Nav className="p-0 p-lg-3">
              <Navbar.Text className="me-lg-4 diy-font-italic">
                {currentUser.displayName && `Hi, ${currentUser.displayName}!`}
              </Navbar.Text>
              {accountType === accountTypeEnum.RENTER && (
                <LinkContainer to="/saved-buildings">
                  <Nav.Link active={false}>Saved</Nav.Link>
                </LinkContainer>
              )}
              {accountType === accountTypeEnum.MANAGER && (
                <LinkContainer to="/manage-listings">
                  <Nav.Link active={false}>Listings</Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/manage-profile">
                <Nav.Link active={false}>Profile</Nav.Link>
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
            <Nav className="p-0 p-lg-3">
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
