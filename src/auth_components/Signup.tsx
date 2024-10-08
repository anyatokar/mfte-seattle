import { useRef, useState } from "react";
import { SignupAuthDataType, useAuth } from "../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { checkPassword } from "../utils/generalUtils";

type Props = {
  onLoginClicked?: () => void;
};

export default function Signup({ onLoginClicked }: Props) {
  const emailRef = useRef() as any;
  const passwordRef = useRef() as any;
  const nameRef = useRef() as any;
  const passwordConfirmRef = useRef() as any;
  const { signupAuth } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errorMessage = checkPassword(
      passwordRef.current.value,
      passwordConfirmRef.current.value
    );

    if (errorMessage) {
      return setError(errorMessage);
    }

    const signupAuthData: SignupAuthDataType = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      name: nameRef.current.value,
      isCompany: false,
      uid: "", // Will be filled when uid is created by Auth.
    };

    try {
      setLoading(true);
      await signupAuth(signupAuthData);
    } catch (error: any) {
      console.error("Firebase Authentication Error:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("There is already a user with this email.");
      }
    }
    setLoading(false);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group id="name" className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="name" ref={nameRef} />
          </Form.Group>
          <Form.Group id="email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control required type="email" ref={emailRef} />
          </Form.Group>
          <Form.Group id="password" className="mb-2">
            <Form.Label>Password (6 or more characters)</Form.Label>
            <Form.Control required type="password" ref={passwordRef} />
          </Form.Group>
          <Form.Group id="password-confirm" className="mb-3">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control required type="password" ref={passwordConfirmRef} />
          </Form.Group>
          <Button
            className="diy-solid-info-button w-100"
            disabled={loading}
            type="submit"
          >
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
