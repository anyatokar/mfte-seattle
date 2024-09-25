import { Profiler, useState } from "react";

import { Timestamp } from "firebase/firestore";
import { sendListingFirestore } from "../utils/firestoreUtils";
import { useAllBuildings } from "../hooks/useAllBuildings";
import ListingAccordion from "../components/ListingAccordion";

import IBuilding from "../interfaces/IBuilding";
import IPage from "../interfaces/IPage";
import IListing from "../interfaces/IListing";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

export type availDataFormType = {
  microNumAvail: number;
  microDateAvail: Timestamp | null;
  studioNumAvail: number;
  studioDateAvail: Timestamp | null;
  oneBedNumAvail: number;
  oneBedDateAvail: Timestamp | null;
  twoBedNumAvail: number;
  twoBedDateAvail: Timestamp | null;
  threePlusBedNumAvail: number;
  threePlusBedDateAvail: Timestamp | null;
};

const AddListingPage: React.FunctionComponent<IPage> = ({ name }) => {
  const { allBuildings } = useAllBuildings();

  const emptyForm: Partial<IListing> & availDataFormType = {
    contactName: "",
    email: "",
    companyName: "",
    buildingName: "",
    url: "",
    message: "",
    microNumAvail: 0,
    microDateAvail: null,
    studioNumAvail: 0,
    studioDateAvail: null,
    oneBedNumAvail: 0,
    oneBedDateAvail: null,
    twoBedNumAvail: 0,
    twoBedDateAvail: null,
    threePlusBedNumAvail: 0,
    threePlusBedDateAvail: null,
  };

  function clearFields(): void {
    setFormFields(emptyForm);
  }

  const [formFields, setFormFields] = useState(emptyForm);

  // event handlers
  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name.endsWith("DateAvail")) {
      // If it's a date field, convert to Firestore Timestamp
      const timestamp = value ? Timestamp.fromDate(new Date(value)) : null;
      setFormFields((prev) => ({
        ...prev,
        [name]: timestamp,
      }));
    } else {
      // For other fields, just update the value
      setFormFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    micro: "Micro/Pods",
    studio: "Studios",
    oneBed: "One Beds",
    twoBed: "Two Beds",
    threePlusBed: "Three+ Beds",
  };

  const unitSizeFields: Array<keyof typeof unitSizeLabels> = [
    "micro",
    "studio",
    "oneBed",
    "twoBed",
    "threePlusBed",
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

            <ListingAccordion />

            <hr className="my-4 break-line-light" />

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
                  <Form.Label>Work email*</Form.Label>
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
                <Form.Group as={Col} className="mb-3 mb-md-0">
                  <Form.Label>Listing URL* (include http://)</Form.Label>
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
              <Form.Group as={Row} className="mb-3">
                <Form.Group as={Col} className="mb-3 mb-md-0">
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Unit Type</th>
                        <th>Number of Units Available</th>
                        <th>Earliest Available Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitSizeFields.map((unitSize) => (
                        <tr key={unitSize}>
                          {/* Unit Size */}
                          <td>{unitSizeLabels[unitSize]}</td>

                          {/* Number of Units Available */}
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              name={`${unitSize}NumAvail`}
                              id={`${unitSize}NumAvail`}
                              onChange={onInputChange}
                              value={Number(formFields[`${unitSize}NumAvail`])}
                            />
                          </td>

                          {/* Earliest Available Date */}
                          <td>
                            <Form.Control
                              type="date"
                              name={`${unitSize}DateAvail`}
                              id={`${unitSize}DateAvail`}
                              onChange={onInputChange}
                              value={
                                formFields[`${unitSize}DateAvail`]
                                  ? formFields[`${unitSize}DateAvail`]
                                      ?.toDate()
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Form.Group>
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

export default AddListingPage;
