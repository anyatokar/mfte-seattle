import { Profiler, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { sendMessageFirestore } from "../utils/firestoreUtils";
import IPage from "../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export type formFieldsType = {
  authorName: string;
  email: string;
  description: string;
  subject: string;
  message: string;
};

const ContactPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (
  props
) => {
  function clearFields(): void {
    setformFields({
      authorName: "",
      email: "",
      description: "",
      subject: "",
      message: "",
    });
  }

  const [formFields, setformFields] = useState({
    authorName: "",
    email: "",
    description: "",
    subject: "",
    message: "",
  });

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const newformFields = {
      ...formFields,
    };
    newformFields[event.target.name as keyof formFieldsType] =
      event.target.value;
    setformFields(newformFields);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    return sendMessageFirestore(formFields)
      .then(() => {
        console.log("Message sent successfully.");
        clearFields();
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <Profiler
      id={props.name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        console.log({
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime,
        });
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-5">Contact us</div>
            <hr className="my-4"></hr>

            <p className="lead">
              We are always looking to improve this website — your feedback is
              welcome and appreciated.
            </p>
            <p>
              This website is not affiliated with the Seattle Office of Housing
              or any property owner.
            </p>
            <ul>
              <li>
                Have questions or feedback about the MFTE program? Please
                contact the&nbsp;
                <a
                  id="seattle-housing-website"
                  href="https://seattle.gov/housing"
                  title="Seattle Office of Housing government website"
                  target="_blank"
                  rel="noreferrer"
                >
                  Seattle Office of Housing
                </a>
                .
              </li>
              <li>
                Have building-specific questions including apartment
                availability, details on tenant eligibility, and the application
                process? Please contact the property directly.
              </li>
            </ul>
            <p>
              We cannot help with the two above bullet points because we are a
              volunteer-run website which uses public data to map MFTE
              properties.
            </p>
            <p>All fields are required.</p>

            <Form onSubmit={handleFormSubmit}>
              <Form.Group className="form-row">
                <Form.Group className="form-group col-md-6">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    required
                    name="authorName"
                    id="authorName"
                    onChange={onInputChange}
                    value={formFields.authorName}
                  />
                </Form.Group>
                <Form.Group className="form-group col-md-6">
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

              <Form.Group className="form-group">
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

              <hr className="my-4 break-line heavy-break-line"></hr>

              <Form.Group className="form-group">
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
              <Form.Group className="form-group col-mb-3">
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
              <Button type="submit" variant="info" className="btn-lg">
                Send message
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default withRouter(ContactPage);
