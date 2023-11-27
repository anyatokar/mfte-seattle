import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import {
  deleteUserFirestore,
  updateEmailFirestore,
  updateNameFirestore,
} from "../utils/firestoreUtils";

export default function UpdateProfile() {
  // TODO: add useRef types, also maybe use useRef to dynamically update
  // user name in navbar and profile, and email in profile
  const displayNameRef = useRef() as any;
  const emailRef = useRef() as any;
  const passwordRef = useRef() as any;
  const passwordConfirmRef = useRef() as any;
  const { currentUser, updateDisplayName, updateEmail, updatePassword } =
    useAuth() as any;
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnyFieldUpdated, setIsAnyFieldUpdated] = useState(false);
  const history = useHistory();

  function isNameUpdated() {
    return displayNameRef.current?.value !== currentUser.displayName;
  }
  function isEmailUpdated() {
    return emailRef.current?.value !== currentUser.email;
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
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setMessage("Oops! Passwords do not match");
    }

    const authPromises = [];
    const firestorePromises: any[] = [];
    setIsLoading(true);
    setMessage("");

    if (isNameUpdated()) {
      authPromises.push(updateDisplayName(displayNameRef.current.value));
      firestorePromises.push(
        updateNameFirestore(currentUser.uid, displayNameRef.current.value)
      );
    }

    if (isEmailUpdated()) {
      authPromises.push(updateEmail(emailRef.current.value));
      firestorePromises.push(
        updateEmailFirestore(currentUser.uid, emailRef.current.value)
      );
    }

    if (isPasswordUpdated()) {
      authPromises.push(updatePassword(passwordRef.current.value));
      // passwords are not stored in Firestore, only in Auth
    }

    Promise.all(authPromises)
      .then(() => {
        // Auth is the source of truth for name/email/password
        // Firestore stores name/email as well but it's still a
        // Success for the user if Firestore update fails (unlikely)
        setMessage("Success! Account updated.");
        console.log("Account updated in Auth.");

        Promise.all(firestorePromises)
          .then(() => {
            console.log("Account updated in Firestore.");
          })
          .catch(() => {
            console.log("Error updating account in Firestore.");
          });
      })
      .catch((error) => {
        console.log(error.code, error.message);
        setMessage(error.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsAnyFieldUpdated(false);
        clearPasswordFields();
      });
  }

  function onDelete(event: any) {
    event.preventDefault();

    deleteUserFirestore(currentUser.uid)
      .then(() => {
        console.log("User successfully deleted from Firestore");

        currentUser
          .delete()
          .then(() => {
            console.log("User successfully deleted from Auth.");
            setMessage("Success! Account deleted.");
            history.push("/");
          })
          .catch((error: any) => {
            console.error("Error removing user from Auth: ", error);
            setMessage(error.message);
          });
      })
      .catch((error: any) => {
        console.error("Error removing user from Firestore: ", error);
        console.error("Did not attempt to remove user from Auth.");
        setMessage(error.message);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6} className="mt-3 mt-md-0">
          <Card>
            <Card.Body>
              {message && message.includes("Success") && (
                <Alert variant="success">{message}</Alert>
              )}
              {message && !message.includes("Success") && (
                <Alert variant="danger">{message}</Alert>
              )}

              <Form onSubmit={handleFormSubmit}>
                {currentUser.displayName && (
                  <Form.Group id="displayName" className="form-group">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      required
                      type="displayName"
                      ref={displayNameRef}
                      defaultValue={currentUser.displayName}
                      onChange={handleChange}
                    />
                  </Form.Group>
                )}
                <Form.Group id="email" className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group id="password" className="form-group">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    placeholder="Leave blank to keep the same"
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group id="password-confirm" className="form-group">
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
                    className="btn btn-info"
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </Card.Body>

            <Card.Footer>
              <div className="w-100 text-center">
                <Button onClick={onDelete} variant="link">
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
