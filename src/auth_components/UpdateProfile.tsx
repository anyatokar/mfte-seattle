import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import firebase from "../db/firebase";
import { Container, Row, Col } from 'react-bootstrap';
import { FirebaseError } from '@firebase/util';

export default function UpdateProfile() {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const passwordConfirmRef = useRef() as any
  const { currentUser, updatePassword, updateEmail } = useAuth() as any
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setMessage("Passwords do not match")
    }

    const promises = []
    setLoading(true)
    setMessage("")

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value))
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value))
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Success: account updated. You'll receive an email confirmation")
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
        setMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function onDelete(event: any) {
    event.preventDefault()
    firebase.firestore().collection("users").doc(currentUser.uid).delete().then(() => {
      console.log("User successfully deleted from Firestore.");
    }).catch((error: unknown) => {
      if (error instanceof FirebaseError) {
        console.error("Error removing user from Firestore: ", error);
        setMessage(error.message);
      }
    });

    currentUser.delete().then(() => {
      console.log("User successfully deleted from Auth.");
      setMessage("Success: account deleted")
      history.push("/")
    }).catch((error: any) => {
      console.error("Error removing user from Auth: ", error);
      setMessage(error.message);
    });
  }
  return (
    <>
      <Container>
        <Row>
          <Col md={5} lg={6}>
            <Card className="saved-homes-profile-update-card">
              <Card.Body>
                {message && message.includes("Success: ") && <Alert variant="success">{message}</Alert>}
                {message && !(message.includes("Success: ")) && <Alert variant="danger">{message}</Alert>}
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group id="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      ref={emailRef}
                      required
                      defaultValue={currentUser.email}
                    />
                  </Form.Group>
                  <Form.Group id="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordRef}
                      placeholder="Leave blank to keep the same"
                    />
                  </Form.Group>
                  <Form.Group id="password-confirm">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control
                      type="password"
                      ref={passwordConfirmRef}
                      placeholder="Leave blank to keep the same"
                    />
                  </Form.Group>
                  <div className="text-center">
                  <Button disabled={loading} className="w-40 btn btn-info" type="submit">
                    Update
                  </Button>
                  </div>
                </Form>
                <div className="w-100 text-center mt-2">
                  <Button onClick={onDelete} variant="link">Delete Account</Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}
