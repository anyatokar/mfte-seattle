import { Profiler, useState } from "react";
import { isProfilerOn } from "../../config/constants";
import { sendMessageFirestore } from "../../utils/firestoreUtils";
import IPage from "../../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export type contactUsFormFieldsType = {
  authorName: string;
  email: string;
  description: string;
  subject: string;
  message: string;
};

const ContactPage: React.FC<IPage> = () => {
  function clearFields(): void {
    setFormFields({
      authorName: "",
      email: "",
      description: "",
      subject: "",
      message: "",
    });
  }

  const [formFields, setFormFields] = useState({
    authorName: "",
    email: "",
    description: "",
    subject: "",
    message: "",
  });

  const [isFormVisible, setIsFormVisible] = useState(true);

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const newFormFields = {
      ...formFields,
    };
    newFormFields[event.target.name as keyof contactUsFormFieldsType] =
      event.target.value;
    setFormFields(newFormFields);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    return sendMessageFirestore(formFields)
      .then(() => {
        console.log("Message sent successfully.");
        clearFields();
        setIsFormVisible(false);
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <Profiler
      id={"Contact"}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-6 mb-5">Contact us</div>
            <p className="lead mb-4">
              We are always looking to improve this website — your feedback is
              welcome and appreciated.
            </p>
            <p>
              Please note, this is an independent website intended solely to map
              rent-reduced units. We are not affiliated with the Seattle Office
              of Housing or any property owners, and we cannot provide
              assistance with specific program or property questions.{" "}
            </p>
            <p>
              As a suggestion, if you have questions or feedback about the MFTE
              program, contact the{" "}
              <a
                id="seattle-housing-website"
                href="https://seattle.gov/housing"
                title="Seattle Office of Housing government website"
                target="_blank"
                rel="noreferrer"
              >
                Seattle Office of Housing
              </a>
              . For inquiries about a specific building such as tenant
              eligibility or the application process, contact the building’s
              management directly.
            </p>

            {isFormVisible ? (
              <>
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

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      required
                      as="select"
                      name="description"
                      id="description"
                      onChange={onInputChange}
                      value={formFields.description}
                    >
                      <option key="blankChoice" hidden></option>
                      <option>Prospective renter</option>
                      <option>Company representative</option>
                      <option>Government representative</option>
                      <option>None of the above</option>
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
              <p>Message sent successfully.</p>
            )}
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default ContactPage;
