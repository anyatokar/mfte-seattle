import { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import {
  deleteUserFirestore,
  UpdateData,
  updateProfileFirestore,
} from "../utils/firestoreUtils";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { checkPassword } from "../utils/generalUtils";
import { accountTypeEnum } from "../types/enumTypes";

type UpdateProfileProps = {
  jobTitle?: string;
  companyName?: string;
};

const UpdateProfile: React.FC<UpdateProfileProps> = ({
  jobTitle,
  companyName,
}) => {
  const displayNameRef = useRef() as any;
  const emailRef = useRef() as any;
  const passwordRef = useRef() as any;
  const passwordConfirmRef = useRef() as any;
  const jobTitleRef = useRef() as any;
  const companyNameRef = useRef() as any;
  const {
    currentUser,
    accountType,
    updateDisplayNameAuth,
    updateEmailAuth,
    updatePasswordAuth,
  } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnyFieldUpdated, setIsAnyFieldUpdated] = useState<boolean>(false);
  const history = useHistory();

  function isNameUpdated() {
    return displayNameRef.current?.value !== currentUser?.displayName;
  }
  function isEmailUpdated() {
    return emailRef.current?.value !== currentUser?.email;
  }
  function isPasswordUpdated() {
    return !!passwordRef.current?.value;
  }

  function isCompanyNameUpdated() {
    return companyNameRef.current?.value !== companyName;
  }

  function isJobTitleUpdated() {
    return jobTitleRef.current?.value !== jobTitle;
  }

  const handleChange = () => {
    isNameUpdated() ||
    isEmailUpdated() ||
    isPasswordUpdated() ||
    isJobTitleUpdated() ||
    isCompanyNameUpdated()
      ? setIsAnyFieldUpdated(true)
      : setIsAnyFieldUpdated(false);
  };

  function clearPasswordFields(): void {
    passwordRef.current.value = null;
    passwordConfirmRef.current.value = null;
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (isPasswordUpdated()) {
      const errorMessage = checkPassword(
        passwordRef.current.value,
        passwordConfirmRef.current.value
      );

      if (errorMessage) {
        setError(errorMessage);
        return;
      }
    }

    const authPromises = [];
    const firestorePromises: any[] = [];
    setIsLoading(true);
    setMessage("");
    setError("");

    if (isNameUpdated()) {
      authPromises.push(updateDisplayNameAuth(displayNameRef.current.value));

      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountType,
        key: "name",
        value: displayNameRef.current.value,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isEmailUpdated()) {
      authPromises.push(updateEmailAuth(emailRef.current.value));

      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountType,
        key: "email",
        value: emailRef.current.value,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isPasswordUpdated()) {
      authPromises.push(updatePasswordAuth(passwordRef.current.value));
      // passwords are not stored in Firestore, only in Auth
    }

    if (isJobTitleUpdated()) {
      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountTypeEnum.MANAGER,
        key: "jobTitle",
        value: jobTitleRef.current.value,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isCompanyNameUpdated()) {
      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountTypeEnum.MANAGER,
        key: "companyName",
        value: companyNameRef.current.value,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    Promise.all(authPromises)
      .then(() => {
        // Auth is the source of truth for name/email/password
        // Firestore stores name/email as well but it's still a
        // Success for the user if Firestore update fails
        setMessage("Success! Account updated.");
        console.log("Account updated in Auth.");

        Promise.all(firestorePromises)
          .then(() => {
            console.log("Account updated in Firestore.");
          })
          .catch((error) => {
            console.error(
              `Error updating account in Firestore: ${error.code}, ${error.message}`
            );
          });
      })
      .catch((error) => {
        console.error("Firebase Authentication Error:", error);

        if (error.code === "auth/email-already-in-use") {
          setError("There is already a user with this email.");
        } else if (error.code === "auth/requires-recent-login") {
          setError(
            "A recent login is required to make this update. Please log out and login first."
          );
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsAnyFieldUpdated(false);
        clearPasswordFields();
      });
  }

  function onDelete(event: any) {
    event.preventDefault();

    deleteUserFirestore(currentUser?.uid, accountType)
      .then(() => {
        console.log("User successfully deleted from Firestore");

        currentUser
          ?.delete()
          .then(() => {
            console.log("User successfully deleted from Auth.");
            setMessage("Success! Account deleted.");
            history.push("/");
          })
          .catch((error: any) => {
            console.error("Error removing user from Auth: ", error);

            if (error.code === "auth/requires-recent-login") {
              setError(
                "A recent login is required to delete account. Please log out and login first."
              );
            } else setError(error.message);
          });
      })
      .catch((error: any) => {
        console.error("Error removing user from Firestore: ", error);
        console.error("Did not attempt to remove user from Auth.");
        setError(error.message);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6} className="mt-3 mt-md-0">
          <Card>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleFormSubmit}>
                <Form.Group id="displayName" className="mb-3">
                  <Form.Label>
                    <strong>Name</strong>
                  </Form.Label>
                  <Form.Control
                    required
                    type="displayName"
                    ref={displayNameRef}
                    defaultValue={currentUser?.displayName || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group id="email" className="mb-3">
                  <Form.Label>
                    <strong>Email</strong>
                  </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser?.email || ""}
                    onChange={handleChange}
                  />
                </Form.Group>

                {accountType === accountTypeEnum.MANAGER && (
                  <>
                    <Form.Group id="job-title" className="mb-3">
                      <Form.Label>
                        <strong>Job Title</strong>
                      </Form.Label>
                      <Form.Control
                        type="job-title"
                        ref={jobTitleRef}
                        defaultValue={jobTitle || ""}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group id="company-name" className="mb-3">
                      <Form.Label>
                        <strong>Company</strong>
                      </Form.Label>
                      <Form.Control
                        type="company-name"
                        ref={companyNameRef}
                        defaultValue={companyName || ""}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </>
                )}

                <hr className="my-4 break-line-light" />

                <Form.Group id="password" className="mb-3">
                  <Form.Label>
                    <strong>Password </strong>(Leave blank to keep the same)
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group id="password-confirm" className="mb-3">
                  <Form.Label>
                    <strong>Confirm Password</strong>
                  </Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button
                    disabled={isLoading || !isAnyFieldUpdated}
                    className="diy-solid-info-button"
                    type="submit"
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </Card.Body>

            <Card.Footer>
              <div className="w-100 text-center">
                <Button
                  className="delete-link"
                  onClick={onDelete}
                  variant="link"
                >
                  Delete Account
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateProfile;
