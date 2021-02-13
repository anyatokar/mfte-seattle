import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import firebase from "../db/firebase"

export default function UpdateProfile() {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const passwordConfirmRef = useRef() as any
  const { currentUser, updatePassword, updateEmail } = useAuth() as any
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  function handleSubmit(e: any) {
    e.preventDefault()
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
        // history.push("/")
        setMessage("Update successful")
      })
      .catch((error) => {
        console.log(error.code)
        console.log(error.message)
        setMessage(error.message)
        // setMessage("Failed to update account")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function onDelete(e: any) {
    e.preventDefault()
    firebase.firestore().collection("users").doc(currentUser.uid).delete().then(() => {
      console.log("User successfully deleted from Firestore.");
    }).catch((error) => {
      console.error("Error removing user from Firestore: ", error);
    });

    currentUser.delete().then(() => {
      console.log("User successfully deleted from Auth.");
    }).catch((error: any) => {
      console.error("Error removing user from Auth: ", error);
    });
  }
  return (
    <>
      <Card style={{ width: '25rem' }}>
        <Card.Body>
          {/* <h2 className="text-center mb-4">Update Profile</h2> */}
          {message === "Update successful" && <Alert variant="success">{message}</Alert>}
          {message && message !== "Update successful" && <Alert variant="danger">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
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
          {/* <Link to="/">Cancel</Link> */}
        <Button onClick={onDelete} variant="link">Delete Account</Button>
      </div>
        </Card.Body>
      </Card>
    </>
  )
}
