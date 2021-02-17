import React, { useRef, useState } from "react"
import { Form, Button, Modal, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"

export default function PasswordReset() {
  const emailRef = useRef() as any
  const { resetPassword } = useAuth() as any
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Login
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  // Signup
  const [showSignup, setShowSignup] = useState(false);

  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);

  async function handleSubmit(e: any) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(emailRef.current.value)
      setMessage("Check your inbox for further instructions")
    } catch {
      setError("Failed to reset password")
    }

    setLoading(false)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email" className="emailField">
            <h6>Enter your email to recieve a reset link in your inbox.</h6>
            <br></br>
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Reset Password
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={handleShowLogin} variant="link">Log In</Button>
            <Modal show={showLogin} onHide={handleCloseLogin}>
              <Login/>
            </Modal>
          <br></br>
          <Button onClick={handleShowSignup} variant="link">Sign Up</Button>
            <Modal show={showSignup} onHide={handleCloseSignup}>
              <Signup />
            </Modal>
        </div>
      </Modal.Footer>
    </>
  )
}
