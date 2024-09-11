import { Profiler, useState } from "react";
import { Link } from "react-router-dom";
import { sendAdInquiryFirestore } from "../utils/firestoreUtils";
import IPage from "../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export type adInquiryFormFieldsType = {
  authorName: string;
  email: string;
  companyName: string;
  propertyNames: string;
  inquiry: string;
};

const AdvertisePage: React.FunctionComponent<IPage> = ({ name }) => {
  function clearFields(): void {
    setFormFields({
      authorName: "",
      email: "",
      companyName: "",
      propertyNames: "",
      inquiry: "",
    });
  }

  const [formFields, setFormFields] = useState({
    authorName: "",
    email: "",
    companyName: "",
    propertyNames: "",
    inquiry: "",
  });

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const newFormFields = {
      ...formFields,
    };
    newFormFields[event.target.name as keyof adInquiryFormFieldsType] =
      event.target.value;
    setFormFields(newFormFields);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    return sendAdInquiryFirestore(formFields)
      .then(() => {
        console.log("Inquiry sent successfully.");
        clearFields();
      })
      .catch((error) => {
        console.error("Error sending inquiry: ", error);
      });
  };

  return (
    <Profiler
      id={name}
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
            <div className="display-5">For Property Owners & Managers</div>
            <hr className="my-4 break-line-light" />

            <p className="lead">
              If you are company representative interested in featuring
              currently available MFTE apartments on this website's&nbsp;
              <Link id="all-buildings" to="./all-buildings">
                MFTE map
              </Link>
              , please get in touch using the inquiry form below.
            </p>
            <p>
              <strong>Metrics: </strong>This website averages nearly 100 active
              daily users and consistently ranks as a top search result for MFTE
              properties in Seattle across major search engines.
            </p>
            <p>
              <strong>Disclaimer: </strong>This website maps buildings
              participating in the MFTE program using publicly available data.
              It is not affiliated with any government agency or property owner.
            </p>

            <hr className="my-4" />

            <p>Fields marked with * are required.</p>
            <Form onSubmit={handleFormSubmit}>
              {/* Name and Email row */}
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                  <Form.Label>Your Name*</Form.Label>
                  <Form.Control
                    required
                    name="authorName"
                    id="authorName"
                    onChange={onInputChange}
                    value={formFields.authorName}
                  />
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Email*</Form.Label>
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

              {/* Company and Buildings row */}
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                  <Form.Label>Company Name*</Form.Label>
                  <Form.Control
                    required
                    type="companyName"
                    name="companyName"
                    id="companyName"
                    onChange={onInputChange}
                    value={formFields.companyName}
                  />
                </Form.Group>
                <Form.Group as={Col} md={6}>
                  <Form.Label>Property Name(s)</Form.Label>
                  <Form.Control
                    type="propertyNames"
                    name="propertyNames"
                    id="propertyNames"
                    onChange={onInputChange}
                    value={formFields.propertyNames}
                  />
                </Form.Group>
              </Form.Group>

              {/* Inquiry */}
              <Form.Group className="mb-3">
                <Form.Label>Inquiry*</Form.Label>
                <Form.Control
                  as="textarea"
                  name="inquiry"
                  id="inquiry"
                  rows={5}
                  onChange={onInputChange}
                  value={formFields.inquiry}
                />
              </Form.Group>

              <Button type="submit" className="diy-solid-info-button" size="lg">
                Submit inquiry
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AdvertisePage;
