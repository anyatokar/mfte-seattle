import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

type Props = {
  onLoginClicked?: () => void;
};

export default function Signup({ onLoginClicked }: Props) {
  const emailRef = useRef() as any;
  const passwordRef = useRef() as any;
  const nameRef = useRef() as any;
  const passwordConfirmRef = useRef() as any;
  const { signup } = useAuth() as any;
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setMessage("Passwords do not match.");
    }

    if (passwordRef.current.value.length < 6) {
      return setMessage("Password must be 6 characters or more.");
    }

    try {
      setMessage("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
      );
    } catch (error: any) {
      console.log(`${error.code}: ${error.message}`);
      setMessage(error.message);
    }
    setLoading(false);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <Alert variant="danger">{message}</Alert>}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group id="name" className="form-group">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="name" ref={nameRef} />
          </Form.Group>
          <Form.Group id="email" className="form-group">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" ref={emailRef} />
          </Form.Group>
          <Form.Group id="password" className="form-group">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              ref={passwordRef}
              placeholder="6 or more characters"
            />
          </Form.Group>
          <Form.Group id="password-confirm" className="form-group">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              required
              type="password"
              ref={passwordConfirmRef}
              placeholder="6 or more characters"
            />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={onLoginClicked} variant="link">
            Log In
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}
