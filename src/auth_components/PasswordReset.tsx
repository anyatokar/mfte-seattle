import { useRef, useState } from "react";
import { Form, Button, Modal, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

type Props = {
  onLoginClicked?: () => void;
  onSignupClicked?: () => void;
};

export default function PasswordReset({ onLoginClicked, onSignupClicked }: Props) {
  const emailRef = useRef() as any;
  const { resetPassword } = useAuth() as any;
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }

    setLoading(false);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Password Reset</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}

        <Form onSubmit={handleFormSubmit}>
          <Form.Group id="email" className="form-group">
            <p>Enter your email to receive a reset link in your inbox.</p>
            <Form.Control required type="email" ref={emailRef} />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Reset Password
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={onSignupClicked} variant="link">
            Sign Up
          </Button>
          <br />
          <Button onClick={onLoginClicked} variant="link">
            Log In
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}
