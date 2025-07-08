import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

type Props = {
  onResetClicked: () => void;
  onSignupClicked: () => void;
  onRepSignupClicked: () => void;
  afterLogin?: () => void;
};

export default function Login({
  onResetClicked,
  onSignupClicked,
  onRepSignupClicked,
  afterLogin,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(email, password);
      if (afterLogin) {
        afterLogin();
      }
    } catch (error: any) {
      console.error("Firebase Authentication Error:", error);

      if (error.code === "auth/wrong-password") {
        setError("Wrong password, please try again.");
      } else if (error.code === "auth/user-not-found") {
        setError(
          "Please check your username. User with this email does not exist."
        );
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Log In</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group id="email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group id="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="dark"
            className="w-100"
            disabled={loading}
            type="submit"
          >
            Log In
          </Button>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100 text-center">
          <Button onClick={onResetClicked} variant="link">
            Reset Password
          </Button>
          <br />
          <Button onClick={onSignupClicked} variant="link">
            Sign Up
          </Button>
          <br />
          <Button onClick={onRepSignupClicked} variant="link">
            Manager Sign Up
          </Button>
        </div>
      </Modal.Footer>
    </>
  );
}
