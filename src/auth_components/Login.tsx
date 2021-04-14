import React, { useRef, useState } from "react"
import { Form, Button, Alert, Modal } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import PasswordReset from "./PasswordReset"
import Signup from "./Signup"

type Props = {
  onResetClicked?: () => void,
  onSignupClicked?: () => void
}

export default function Login({
  onResetClicked,
  onSignupClicked
}: Props) {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const { login } = useAuth() as any

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

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
          <Button onClick={onResetClicked} variant="link">Reset Password</Button>
          <br></br>
          <Button onClick={onSignupClicked} variant="link">Sign Up</Button>
        </div>
      </Modal.Footer>
    </>
  )
}
