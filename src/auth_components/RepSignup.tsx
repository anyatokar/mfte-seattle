import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { checkPassword } from "../utils/generalUtils";
import { accountTypeEnum } from "../types/enumTypes";
import { SignupAuthDataType } from "../interfaces/IUser";

type Props = {
  onLoginClicked?: () => void;
};

export default function Signup({ onLoginClicked }: Props) {
  const [formFields, setFormFields] = useState({
    email: "",
    password: "",
    name: "",
    passwordConfirm: "",
    companyName: "",
    jobTitle: "",
  });
  const { signupAuth } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errorMessage = checkPassword(
      formFields.password,
      formFields.passwordConfirm
    );

    if (errorMessage) {
      return setError(errorMessage);
    }

    const signupAuthData: SignupAuthDataType = {
      email: formFields.email,
      password: formFields.password,
      name: formFields.name,
      accountType: accountTypeEnum.MANAGER,
      companyName: formFields.companyName,
      jobTitle: formFields.jobTitle,
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
        <Modal.Title>Manager Sign Up</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleFormSubmit}>
          <Form.Group id="name" className="mb-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="name"
              onChange={(e) =>
                setFormFields({ ...formFields, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group id="email" className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              onChange={(e) =>
                setFormFields({ ...formFields, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group id="companyName" className="mb-2">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              required
              type="companyName"
              onChange={(e) =>
                setFormFields({ ...formFields, companyName: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group id="jobTitle" className="mb-2">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              required
              type="jobTitle"
              onChange={(e) =>
                setFormFields({ ...formFields, jobTitle: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group id="password" className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              onChange={(e) =>
                setFormFields({ ...formFields, password: e.target.value })
              }
            />
            <Form.Text className="text-muted">6 or more characters</Form.Text>
          </Form.Group>
          <Form.Group id="password-confirm" className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              required
              type="password"
              onChange={(e) =>
                setFormFields({
                  ...formFields,
                  passwordConfirm: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button
            variant="dark"
            className="w-100"
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
