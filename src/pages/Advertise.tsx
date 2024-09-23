import { Profiler, useState } from "react";
import { Link } from "react-router-dom";
import { sendAdInquiryFirestore } from "../utils/firestoreUtils";
import IPage from "../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export type listingFormFieldsType = {
  authorName: string;
  email: string;
  companyName: string;
  buildingName: string;
  url: string;
  micro: number;
  studio: number;
  oneBed: number;
  twoBed: number;
  threePlusBed: number;
  message: string;
};

const AdvertisePage: React.FunctionComponent<IPage> = ({ name }) => {
  function clearFields(): void {
    setFormFields({
      authorName: "",
      email: "",
      companyName: "",
      buildingName: "",
      url: "",
      micro: 0,
      studio: 0,
      oneBed: 0,
      twoBed: 0,
      threePlusBed: 0,
      message: "",
    });
  }

  const [formFields, setFormFields] = useState({
    authorName: "",
    email: "",
    companyName: "",
    buildingName: "",
    url: "",
    micro: 0,
    studio: 0,
    oneBed: 0,
    twoBed: 0,
    threePlusBed: 0,
    message: "",
  });

  // event handlers
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const unitSizeLabels = {
    micro: "Micro/Pods",
    studio: "Studios",
    oneBed: "One Beds",
    twoBed: "Two Beds",
    threePlusBed: "Three Beds+",
  };

  const unitSizes: Array<keyof typeof unitSizeLabels> = [
    "micro",
    "studio",
    "oneBed",
    "twoBed",
    "threePlusBed",
  ];
  const buildingNames = ["Building A", "Building B", "Building C"];

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
              <strong>Metrics: </strong>This website averages 3,000 active
              monthly users and consistently ranks as a top search result for
              MFTE properties in Seattle across major search engines.
              Recognizing that more than half of our visits come from mobile
              devices, this site provides an optimized experience across phones,
              tablets, and desktops, making it easier for a wider range of users
              to find MFTE units.
            </p>
            <p>
              <strong>Disclaimer: </strong>This website maps buildings
              participating in the MFTE program using publicly available data.
              It is not affiliated with any government agency or property owner.
            </p>

            <hr className="my-4" />

            <p>Fields marked with * are required.</p>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                  <Form.Label>Building Name*</Form.Label>
                  <Form.Select
                    required
                    name="buildingName"
                    id="buildingName"
                    onChange={onSelectChange}
                    value={formFields.buildingName}
                  >
                    <option value="">Select a building</option>
                    {buildingNames.map((buildingName, index) => (
                      <option key={index} value={buildingName}>
                        {buildingName}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Company row */}
                <Form.Group as={Col} md={6}>
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
              </Form.Group>

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

              {/* URL */}
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                  <Form.Label>Listing URL*</Form.Label>
                  <Form.Control
                    required
                    type="url"
                    name="url"
                    id="url"
                    onChange={onInputChange}
                    value={formFields.url}
                  />
                </Form.Group>
              </Form.Group>

              <p>
                {formFields.buildingName
                  ? `Availability in ${formFields.buildingName}:`
                  : "Availability:"}
              </p>

              <Form.Group as={Row} className="mb-3">
                {unitSizes.map((unitSize) => (
                  <Form.Group as={Col} md={2} key={unitSize}>
                    <Form.Label>{unitSizeLabels[unitSize]}</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      name={unitSize}
                      id={unitSize}
                      onChange={onInputChange}
                      value={formFields[unitSize]}
                    />
                  </Form.Group>
                ))}
              </Form.Group>

              {/* Message */}
              <Form.Group className="mb-3">
                <Form.Label>
                  Any additional notes (questions and feedback welcome)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  id="message"
                  rows={5}
                  onChange={onInputChange}
                  value={formFields.message}
                />
              </Form.Group>

              <Button type="submit" className="diy-solid-info-button" size="lg">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AdvertisePage;
