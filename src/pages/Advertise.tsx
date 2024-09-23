import { Profiler, useState } from "react";
import { Link } from "react-router-dom";
import { sendListingFirestore } from "../utils/firestoreUtils";
import { useAllBuildings } from "../hooks/useAllBuildings";

import IBuilding from "../interfaces/IBuilding";
import IPage from "../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

const AdvertisePage: React.FunctionComponent<IPage> = ({ name }) => {
  const { allBuildings, loading } = useAllBuildings();

  function clearFields(): void {
    setFormFields({
      contactName: "",
      email: "",
      companyName: "",
      buildingName: "",
      url: "",
      microNumAvail: 0,
      studioNumAvail: 0,
      oneBedNumAvail: 0,
      twoBedNumAvail: 0,
      threePlusBedNumAvail: 0,
      message: "",
    });
  }

  const [formFields, setFormFields] = useState({
    contactName: "",
    email: "",
    companyName: "",
    buildingName: "",
    url: "",
    microNumAvail: 0,
    studioNumAvail: 0,
    oneBedNumAvail: 0,
    twoBedNumAvail: 0,
    threePlusBedNumAvail: 0,
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

  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>();

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    // This assumes building names are unique.
    const selectedBuilding = allBuildings.find(
      (building) => value === building.buildingName
    );

    setSelectedBuilding(selectedBuilding || null);
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    return sendListingFirestore(formFields, selectedBuilding?.buildingID)
      .then(() => {
        console.log("Availability data submitted successfully.");
        clearFields();
      })
      .catch((error) => {
        console.error("Error sending availability data: ", error);
      });
  };

  const unitSizeLabels = {
    microNumAvail: "Micro/Pods",
    studioNumAvail: "Studios",
    oneBedNumAvail: "One Beds",
    twoBedNumAvail: "Two Beds",
    threePlusBedNumAvail: "Three+ Beds",
  };

  const numAvailFields: Array<keyof typeof unitSizeLabels> = [
    "microNumAvail",
    "studioNumAvail",
    "oneBedNumAvail",
    "twoBedNumAvail",
    "threePlusBedNumAvail",
  ];

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
                    {allBuildings
                      .sort((a, b) =>
                        a.buildingName.localeCompare(b.buildingName)
                      )
                      .map((selectedBuilding) => (
                        <option
                          key={selectedBuilding.buildingID}
                          value={selectedBuilding.buildingName}
                        >
                          {selectedBuilding.buildingName}
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

              {/* Address */}
              <Form.Group as={Col}>
                {selectedBuilding && (
                  <p>
                    {selectedBuilding.streetNum} {selectedBuilding.street}
                    <br />
                    {selectedBuilding.city}, {selectedBuilding.state}{" "}
                    {selectedBuilding.zip}
                    <br />
                    {selectedBuilding.phone}
                    {selectedBuilding.phone2 ? <br /> : null}
                    {selectedBuilding.phone2}
                  </p>
                )}
              </Form.Group>

              {/* Name and Email row */}
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
                  <Form.Label>Your Name*</Form.Label>
                  <Form.Control
                    required
                    name="contactName"
                    id="contactName"
                    onChange={onInputChange}
                    value={formFields.contactName}
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
                  ? `Availability at ${selectedBuilding?.buildingName}:`
                  : "Availability:"}
              </p>

              <Form.Group as={Row} className="mb-3">
                {numAvailFields.map((numAvailField) => (
                  <Form.Group as={Col} md={2} key={numAvailField}>
                    <Form.Label>{unitSizeLabels[numAvailField]}</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      name={numAvailField}
                      id={numAvailField}
                      onChange={onInputChange}
                      value={formFields[numAvailField]}
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
