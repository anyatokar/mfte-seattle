import { useState } from "react";
import config from "../../config/config";
import { sendMessageFirestore } from "../../utils/firestoreUtils";
import RenderProfiler from "../../components/utility/RenderProfiler";
import IPage from "../../interfaces/IPage";
import { IContactFormFields } from "../../interfaces/IContactFormFields";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const ContactPage: React.FC<IPage> = () => {
  function clearFields(): void {
    setFormFields({
      authorName: "",
      email: "",
      role: "",
      subject: "",
      message: "",
    });
  }

  const [formFields, setFormFields] = useState({
    authorName: "",
    email: "",
    role: "",
    subject: "",
    message: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [sentMessage, setSentMessage] = useState("");

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const newFormFields = {
      ...formFields,
    };
    newFormFields[event.target.name as keyof IContactFormFields] =
      event.target.value;
    setFormFields(newFormFields);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    return sendMessageFirestore(formFields)
      .then(() => {
        console.log("Message sent successfully.");
        setSentMessage(formFields.message);
        clearFields();
        setIsFormVisible(false);
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  const seattleHousingLink = (
    <a
      id="seattle-housing-website"
      href="https://seattle.gov/housing"
      title="Seattle Office of Housing government website"
      target="_blank"
      rel="noreferrer"
    >
      Seattle Office of Housing
    </a>
  );

  return (
    <RenderProfiler id="Contact" isProfilerOn={config.debug.isProfilerOn}>
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-6 mb-5">Contact us</div>
            {isFormVisible ? (
              <>
                <p className="lead mb-4">
                  We are always looking to improve this website — your feedback
                  is welcome and appreciated.
                </p>
                <p>
                  ⚠️ Please note, this is an independent website intended only
                  to map rent-reduced units.
                </p>
                <p>
                  <strong>
                    For general questions about rent-reduced and affordable
                    housing programs, or help with securing housing, contact the{" "}
                    {seattleHousingLink}.
                  </strong>
                </p>
                <p>
                  {" "}
                  <strong>
                    For questions about a specific building such as tenant
                    eligibility or the application process, contact the
                    building’s management directly.
                  </strong>{" "}
                </p>

                <p>All fields are required.</p>

                <Form onSubmit={handleFormSubmit}>
                  {/* Name and Email row */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Group as={Col} md={6} className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        required
                        name="authorName"
                        id="authorName"
                        onChange={onInputChange}
                        value={formFields.authorName}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        id="email"
                        onChange={onInputChange}
                        value={formFields.email}
                      />
                    </Form.Group>
                  </Form.Group>

                  {/* Role */}
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      name="role"
                      id="role"
                      onChange={onInputChange}
                      value={formFields.role}
                    >
                      <option key="blankChoice" hidden></option>
                      <option>Prospective renter</option>
                      <option>Company representative</option>
                      <option>Government representative</option>
                      <option>Other</option>
                    </Form.Control>
                  </Form.Group>

                  <hr className="my-4" />

                  {/* Subject */}
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      name="subject"
                      id="subject"
                      onChange={onInputChange}
                      value={formFields.subject}
                    >
                      <option key="blankChoice" hidden></option>
                      <option>Feature suggestion</option>
                      <option>Update building data</option>
                      <option>Website bug report</option>
                      <option>Help with using this website</option>
                      <option>Kind words</option>
                      <option>Other</option>
                    </Form.Control>
                  </Form.Group>

                  {/* Message */}
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      required
                      as="textarea"
                      name="message"
                      id="message"
                      rows={5}
                      onChange={onInputChange}
                      value={formFields.message}
                    />
                  </Form.Group>
                  <Form.Group className="text-end">
                    <Button type="submit" variant="success">
                      Send
                    </Button>
                  </Form.Group>
                </Form>
              </>
            ) : (
              <>
                <p>Thank you, your message was sent successfully.</p>
                <p>
                  Please note, this website is independent and not affiliated
                  with the Seattle Office of Housing.
                </p>
                <p>
                  <strong>
                    If your message concerned an urgent housing issue, this is
                    not the right place — please contact an appropriate agency
                    or organization for immediate assistance.
                  </strong>
                </p>
                <ul>
                  <li>
                    For questions about rent-reduced housing programs or your
                    tenant rights, contact the {seattleHousingLink}.
                  </li>
                  <li>
                    For questions about your application to a specific building,
                    contact the building management.
                  </li>
                </ul>
                <p>Your message:</p>
                <p>{sentMessage}</p>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </RenderProfiler>
  );
};

export default ContactPage;
