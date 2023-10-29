import { useRef, useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { FirebaseError } from '@firebase/util';

type Props = {
  onResetClicked: () => void,
  onSignupClicked: () => void,
  afterLogin?: () => void
}

export default function Login({
  onResetClicked,
  onSignupClicked,
  afterLogin
}: Props) {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const { login } = useAuth() as any

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setMessage("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      if (afterLogin) { afterLogin() }
    } catch(error: unknown) {
      if (error instanceof FirebaseError) {
        console.log(error.code)
        const userMessage = error.code === 'auth/wrong-password' ? 'Wrong password, please try again.' : error.message
        console.log(error.message)
        setMessage(userMessage)
      }
    }
    setLoading(false)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <Alert variant="danger">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group id="email" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              ref={emailRef}
            />
          </Form.Group>
          <Form.Group id="password" className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              ref={passwordRef}
            />
          </Form.Group>
          <Button
            disabled={loading}
            className="w-100"
            type="submit"
          >
            Log In
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={onResetClicked} variant="link">Reset Password</Button>
          <br />
          <Button onClick={onSignupClicked} variant="link">Sign Up</Button>
        </div>
      </Modal.Footer>
    </>
  )
}
