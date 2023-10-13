import { useRef, useState } from "react";
import { Form, Button, Alert, Modal } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import { FirebaseError } from '@firebase/util';

type Props = {
  onResetClicked?: () => void,
  onSignupClicked?: () => void,
  didClickSavedBuildings: boolean
}

export default function Login({
  onResetClicked,
  onSignupClicked,
  didClickSavedBuildings
}: Props) {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const { login } = useAuth() as any

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      setMessage("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      if (didClickSavedBuildings) { history.push("./saved-homes") }
    } catch(error:unknown) {
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
