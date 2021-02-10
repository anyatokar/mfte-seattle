import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import ForgotPassword from "./ForgotPassword"
import Signup from "./Signup"

export default function Login() {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const { login } = useAuth() as any
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()



  const [showSignup, setShowSignup] = useState(false);

  const handleCloseSignup = () => setShowSignup(false);
  const handleShowSignup = () => setShowSignup(true);



  const [showPassReset, setShowPassReset] = useState(false);

  const handleClosePassReset = () => setShowPassReset(false);
  const handleShowPassReset = () => setShowPassReset(true);

  async function handleSubmit(e: any) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      // history.push("/")
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (
    <>
  
            <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* <h2 className="text-center mb-4">Log In</h2> */}
          {error && <Alert variant="danger">{error}</Alert>}
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
        <div className="w-100 text-center mt-3">
          <Button onClick={handleShowPassReset}>Forgot Password?</Button>
          <Modal show={showPassReset} onHide={handleClosePassReset}>
            <ForgotPassword />
          </Modal>
        </div>

        <div className="w-100 text-center mt-2">
          Need an account? 
          <Button onClick={handleShowSignup}>Sign Up</Button>
          <Modal show={showSignup} onHide={handleCloseSignup}>
            <Signup />
          </Modal>
        </div>
      </Modal.Footer>
      


    </>
  )
}
