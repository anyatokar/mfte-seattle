import React, { useRef, useState } from "react"
import { Form, Button, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import PasswordReset from "./PasswordReset"
import Signup from "./Signup"

export default function Login() {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const { login } = useAuth() as any

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Signup
  const [showSignup, setShowSignup] = useState(false);

  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);

  // Password Reset
  const [showPassReset, setShowPassReset] = useState(false);

  const handleClosePassReset = () => setShowPassReset(false);
  const handleShowPassReset = () => setShowPassReset(true);

  async function handleSubmit(e: any) {
    e.preventDefault()
    try {
      setMessage("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
    } catch(error) {
      console.log(error.code)
      console.log(error.message)
      setMessage(error.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100 btn-modal btn btn-outline" type="submit">
            Log In
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={handleShowPassReset} variant="link">Reset Password</Button>
            <Modal show={showPassReset} onHide={handleClosePassReset}>
              <PasswordReset />
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
