import React, { useRef, useState } from "react"
import { Form, Button, Modal, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link } from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"

export default function ForgotPassword() {
  const emailRef = useRef() as any
  const { resetPassword } = useAuth() as any
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);


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
          {/* <h2 className="text-center mb-4">Password Reset</h2> */}
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Reset Password
            </Button>
          </Form>
          </Modal.Body>
          <Modal.Footer>
          <div className="w-100 text-center mt-3">
            Already have an account? <Button onClick={handleShowLogin}>Log In</Button>
            <Modal show={showLogin} onHide={handleCloseLogin}>
              <Login/>
            </Modal>
          </div>

      <div className="w-100 text-center mt-2">
        Need an account? <Button onClick={handleShowSignup}>Sign Up</Button>
        <Modal show={showSignup} onHide={handleCloseSignup}>
              <Signup />
            </Modal>
      </div>
      </Modal.Footer>
    </>
  )
}
