import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

type Props = {
  onLoginClicked?: () => void;
  onSignupClicked?: () => void;
  onRepSignupClicked?: () => void;
};

export default function PasswordReset({
  onLoginClicked,
  onSignupClicked,
  onRepSignupClicked,
}: Props) {
  const emailRef = useRef() as any;
  const { resetPasswordAuth } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPasswordAuth(emailRef.current.value);
      setMessage("Please check your inbox for the reset link.");
    } catch (error: any) {
      console.error("Firebase Authentication Error:", error);

      if (error.code === "auth/user-not-found") {
        setError("User with this email does not exist.");
      } else {
        setError(error.message);
      }
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
          <Form.Group id="email" className="mb-3">
            <p>Enter your email to receive a reset link in your inbox.</p>
            <Form.Control required type="email" ref={emailRef} />
          </Form.Group>
          <Button
            className="diy-solid-info-button w-100"
            disabled={loading}
            type="submit"
          >
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
          <Button onClick={onRepSignupClicked} variant="link">
            Manager Sign Up
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
