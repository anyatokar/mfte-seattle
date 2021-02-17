import React, { useRef, useState } from "react"
import { Form, Button, Modal, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"
import Login from "./Login"

export default function Signup() {
  const emailRef = useRef() as any
  const passwordRef = useRef() as any
  const nameRef = useRef() as any
  const passwordConfirmRef = useRef() as any
  const { signup } = useAuth() as any
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      history.push("/")
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
          <Button onClick={handleShow} variant="link">Log In</Button>
          <Modal show={show} onHide={handleClose}>
            <Login/>
          </Modal>
        </div>
      </Modal.Footer>
    </>
  )
}
