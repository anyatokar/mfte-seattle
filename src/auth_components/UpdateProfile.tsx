import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import {
  deleteUserFirestore,
  updateEmailFirestore,
  updateNameFirestore,
} from "../utils/firestoreUtils";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { checkPassword } from "../utils/generalUtils";

export default function UpdateProfile() {
  // TODO: add useRef types, also maybe use useRef to dynamically update
  // user name in navbar and profile, and email in profile
  const displayNameRef = useRef() as any;
  const emailRef = useRef() as any;
  const passwordRef = useRef() as any;
  const passwordConfirmRef = useRef() as any;
  const {
    currentUser,
    updateDisplayNameAuth,
    updateEmailAuth,
    updatePasswordAuth,
  } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnyFieldUpdated, setIsAnyFieldUpdated] = useState(false);
  const history = useHistory();

  function isNameUpdated() {
    return displayNameRef.current?.value !== currentUser?.displayName;
  }
  function isEmailUpdated() {
    return emailRef.current?.value !== currentUser?.email;
  }
  function isPasswordUpdated() {
    return !!passwordRef.current?.value;
  }

  const handleChange = () => {
    isNameUpdated() || isEmailUpdated() || isPasswordUpdated()
      ? setIsAnyFieldUpdated(true)
      : setIsAnyFieldUpdated(false);
  };

  function clearPasswordFields(): void {
    passwordRef.current.value = null;
    passwordConfirmRef.current.value = null;
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isPasswordUpdated()) {
      const errorMessage = checkPassword(
        passwordRef.current.value,
        passwordConfirmRef.current.value
      );

      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }

    const authPromises = [];
    const firestorePromises: any[] = [];
    setIsLoading(true);
    setMessage("");
    setError("");

    if (isNameUpdated()) {
      authPromises.push(updateDisplayNameAuth(displayNameRef.current.value));
      firestorePromises.push(
        updateNameFirestore(currentUser?.uid, displayNameRef.current.value)
      );
    }

    if (isEmailUpdated()) {
      authPromises.push(updateEmailAuth(emailRef.current.value));
      firestorePromises.push(
        updateEmailFirestore(currentUser?.uid, emailRef.current.value)
      );
    }

    if (isPasswordUpdated()) {
      authPromises.push(updatePasswordAuth(passwordRef.current.value));
      // passwords are not stored in Firestore, only in Auth
    }

    Promise.all(authPromises)
      .then(() => {
        // Auth is the source of truth for name/email/password
        // Firestore stores name/email as well but it's still a
        // Success for the user if Firestore update fails
        setMessage("Success! Account updated.");
        console.log("Account updated in Auth.");

        Promise.all(firestorePromises)
          .then(() => {
            console.log("Account updated in Firestore.");
          })
          .catch((error) => {
            console.error(
              `Error updating account in Firestore: ${error.code}, ${error.message}`
            );
          });
      })
      .catch((error) => {
        console.error("Firebase Authentication Error:", error);

        if (error.code === "auth/email-already-in-use") {
          setError("There is already a user with this email.");
        } else if (error.code === "auth/requires-recent-login") {
          setError(
            "A recent login is required to make this update. Please log out and login first."
          );
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsAnyFieldUpdated(false);
        clearPasswordFields();
      });
  }

  function onDelete(event: any) {
    event.preventDefault();

    deleteUserFirestore(currentUser?.uid)
      .then(() => {
        console.log("User successfully deleted from Firestore");

        currentUser
          ?.delete()
          .then(() => {
            console.log("User successfully deleted from Auth.");
            setMessage("Success! Account deleted.");
            history.push("/");
          })
          .catch((error: any) => {
            console.error("Error removing user from Auth: ", error);

            if (error.code === "auth/requires-recent-login") {
              setError(
                "A recent login is required to delete account. Please log out and login first."
              );
            } else setError(error.message);
          });
      })
      .catch((error: any) => {
        console.error("Error removing user from Firestore: ", error);
        console.error("Did not attempt to remove user from Auth.");
        setError(error.message);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6} className="mt-3 mt-md-0">
          <Card>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleFormSubmit}>
                <Form.Group id="displayName" className="mb-2">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    type="displayName"
                    ref={displayNameRef}
                    defaultValue={currentUser?.displayName || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group id="email" className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser?.email || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group id="password" className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group id="password-confirm" className="mb-3">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    placeholder="Leave blank to keep the same"
                    onChange={handleChange}
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    disabled={isLoading || !isAnyFieldUpdated}
                    className="diy-solid-info-button"
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </Card.Body>

            <Card.Footer>
              <div className="w-100 text-center">
                <Button
                  className="delete-account"
                  onClick={onDelete}
                  variant="link"
                >
                  Delete Account
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
