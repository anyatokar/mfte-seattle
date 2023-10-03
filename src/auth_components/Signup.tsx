import { useRef, useState } from "react"
import { Form, Button, Modal, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"

type Props = {
  onLoginClicked?: () => void
}

export default function Signup({
  onLoginClicked
}: Props) {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const nameRef = useRef() as any
  const passwordConfirmRef = useRef() as any
  const { signup } = useAuth() as any
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setMessage("Passwords do not match")
    }

    if (passwordRef.current.value.length < 6) {
      return setMessage("Password must be 6 characters or more")
    }

    try {
      setMessage("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value)
    } catch(error:any) {
      console.log(error.code)
      console.log(error.message)
      setMessage(error.message)
    }
    setLoading(false)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="name" ref={nameRef} required />
          </Form.Group>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} placeholder="6 or more characters"required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} placeholder="6 or more characters"required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={onLoginClicked} variant="link">Log In</Button>
        </div>
      </Modal.Footer>
    </>
  )
}
