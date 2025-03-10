import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { accountTypeEnum, confirmModalTypeEnum } from "../types/enumTypes";
import {
  deleteUserFirestore,
  getManagerProfileFirestore,
  UpdateData,
  updateProfileFirestore,
} from "../utils/firestoreUtils";
import { checkPassword } from "../utils/generalUtils";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import AreYouSureModal from "./AreYouSureModal";

const Profile: React.FC = () => {
  // TODO: This is a lot of states - put the fields in an object?
  const [isLoading, setIsLoading] = useState(false);
  const {
    currentUser,
    accountType,
    updateDisplayNameAuth,
    updateEmailAuth,
    updatePasswordAuth,
  } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [originalProfileData, setOriginalProfileData] = useState({
    jobTitle: "",
    companyName: "",
  });
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAnyFieldUpdated, setIsAnyFieldUpdated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser && accountType === accountTypeEnum.MANAGER) {
        try {
          const data = await getManagerProfileFirestore(currentUser.uid);
          const jobTitle = data?.jobTitle || "";
          const companyName = data?.companyName || "";
          setJobTitle(jobTitle);
          setCompanyName(companyName);
          setOriginalProfileData({
            jobTitle: jobTitle,
            companyName: companyName,
          });
        } catch (error) {
          console.error("Error fetching manager profile:", error);
        }
      }
    };

    fetchProfile();
  }, [currentUser, accountType]);

  function isNameUpdated(): boolean {
    return displayName !== currentUser?.displayName;
  }

  function isEmailUpdated(): boolean {
    return email !== currentUser?.email;
  }

  function isPasswordUpdated(): boolean {
    return !!password;
  }

  function isJobTitleUpdated(): boolean {
    return jobTitle !== originalProfileData.jobTitle;
  }

  function isCompanyNameUpdated(): boolean {
    return companyName !== originalProfileData.companyName;
  }

  function handleNameChange(value: string): void {
    if (value !== currentUser?.displayName) {
      setIsAnyFieldUpdated(true);
    } else {
      setIsAnyFieldUpdated(false);
    }
  }

  function handleEmailChange(value: string): void {
    if (value !== currentUser?.email) {
      setIsAnyFieldUpdated(true);
    } else {
      setIsAnyFieldUpdated(false);
    }
  }

  function handlePasswordChange(value: string): void {
    if (value) {
      setIsAnyFieldUpdated(true);
    } else {
      setIsAnyFieldUpdated(false);
    }
  }

  function handleJobTitleChange(value: string): void {
    if (value !== originalProfileData.jobTitle) {
      setIsAnyFieldUpdated(true);
    } else {
      setIsAnyFieldUpdated(false);
    }
  }

  function handleCompanyNameChange(value: string): void {
    if (value !== originalProfileData.companyName) {
      setIsAnyFieldUpdated(true);
    } else {
      setIsAnyFieldUpdated(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      setError("");
      setMessage("");
      return;
    }

    if (isPasswordUpdated()) {
      const errorMessage = checkPassword(password, passwordConfirm);

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
      authPromises.push(updateDisplayNameAuth(displayName));

      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountType,
        key: "name",
        value: displayName,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isEmailUpdated()) {
      authPromises.push(updateEmailAuth(email));

      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountType,
        key: "email",
        value: email,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isPasswordUpdated()) {
      authPromises.push(updatePasswordAuth(password));
      // passwords are not stored in Firestore, only in Auth
    }

    if (isJobTitleUpdated()) {
      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountTypeEnum.MANAGER,
        key: "jobTitle",
        value: jobTitle,
      };

      firestorePromises.push(updateProfileFirestore(updateData));
    }

    if (isCompanyNameUpdated()) {
      const updateData: UpdateData = {
        uid: currentUser?.uid,
        accountType: accountTypeEnum.MANAGER,
        key: "companyName",
        value: companyName,
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
            setIsEditing(false);
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
            "A recent login is required to update your email or password. Please log out and login first."
          );
        } else {
          setError(error.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsAnyFieldUpdated(false);
        resetForm();
      });
  }

  function resetForm(): void {
    setDisplayName(currentUser?.displayName || "");
    setEmail(currentUser?.email || "");
    // TODO: The profile data should probably be pulled from Firestore, not state.
    setJobTitle(jobTitle);
    setCompanyName(companyName);
    setPassword("");
    setPasswordConfirm("");
    setIsAnyFieldUpdated(false);
    setIsEditing(false);
  }

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleConfirm = () => {
    deleteUserFirestore(currentUser?.uid, accountType)
      .then(() => {
        console.log("User successfully deleted from Firestore");

        currentUser
          ?.delete()
          .then(() => {
            console.log("User successfully deleted from Auth.");
            setMessage("Success! Account deleted.");
            navigate("/");
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

    handleClose();
  };

  function onDelete(event: React.MouseEvent<HTMLElement>): void {
    event.preventDefault();
    handleShow();
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={10}>
          <Card>
            <Card.Body>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleFormSubmit}>
                <Row className="mb-2 d-flex align-items-center">
                  <Col sm={4}>
                    <strong>Name: </strong>
                  </Col>
                  <Col>
                    {isEditing ? (
                      <Form.Control
                        required
                        type="text"
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                          handleNameChange(e.target.value);
                        }}
                      />
                    ) : (
                      displayName
                    )}
                  </Col>
                </Row>

                <Row className="mb-2 d-flex align-items-center">
                  <Col sm={4}>
                    <strong>Email: </strong>
                  </Col>
                  <Col>
                    {isEditing ? (
                      <Form.Control
                        required
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          handleEmailChange(e.target.value);
                        }}
                      />
                    ) : (
                      email
                    )}
                  </Col>
                </Row>

                {accountType === accountTypeEnum.MANAGER && (
                  <>
                    <Row className="mb-2 d-flex align-items-center">
                      <Col sm={4}>
                        <strong>Job Title: </strong>
                      </Col>
                      <Col>
                        {isEditing ? (
                          <Form.Control
                            required
                            type="text"
                            value={jobTitle}
                            onChange={(e) => {
                              setJobTitle(e.target.value);
                              handleJobTitleChange(e.target.value);
                            }}
                          />
                        ) : (
                          jobTitle
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2 d-flex align-items-center">
                      <Col sm={4}>
                        <strong>Company: </strong>
                      </Col>
                      <Col>
                        {isEditing ? (
                          <Form.Control
                            required
                            type="text"
                            value={companyName}
                            onChange={(e) => {
                              setCompanyName(e.target.value);
                              handleCompanyNameChange(e.target.value);
                            }}
                          />
                        ) : (
                          companyName
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-2 d-flex align-items-center">
                      <Col sm={4}>
                        <strong>Account Type: </strong>
                      </Col>
                      <Col>Manager</Col>
                    </Row>
                  </>
                )}

                {isEditing && (
                  <Row className="mb-2 d-flex align-items-center">
                    <Col sm={4}>
                      <strong>Password: </strong>
                    </Col>
                    <Col>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handlePasswordChange(e.target.value);
                        }}
                      />
                      <Form.Text className="text-muted">
                        Leave blank to keep the same
                      </Form.Text>
                    </Col>
                  </Row>
                )}

                {isEditing && (
                  <Row className="mb-2 d-flex align-items-center">
                    <Col sm={4}>
                      <strong>Confirm Password: </strong>
                    </Col>
                    <Col>
                      <Form.Control
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                      />
                    </Col>
                  </Row>
                )}

                <div className="d-flex justify-content-center">
                  <Stack direction={"horizontal"} gap={2}>
                    {isEditing && (
                      <Button
                        variant="outline-danger"
                        onClick={() => resetForm()}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      disabled={isLoading || (isEditing && !isAnyFieldUpdated)}
                      variant="success"
                      type="submit"
                    >
                      {isEditing ? "Save" : "Update"}
                    </Button>
                  </Stack>
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

      <AreYouSureModal
        showModal={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.ACCOUNT_DELETE}
      />
    </Container>
  );
};

export default Profile;
