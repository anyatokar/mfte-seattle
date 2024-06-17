import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";
import IListingAptDetails from "../interfaces/IListingAptDetails";
import { Timestamp } from "firebase/firestore";
import { addListingFirestore, sendMessageFirestore } from "../utils/firestoreUtils";

interface AddPropertyModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (property: IListing) => void;
  isEditing: boolean;
  property: Partial<IListing> | null;
}

export type listingFormFieldsType = {
  name: string;
  address: string;
  url: string;
  startDate: string;
  endDate: string;
  lastUpdateDate: string;
  // hasAnyAvailability: boolean | undefined;
  listingId: string;
  buildingID: string;
  seduDateAvail: string;
  seduRent: string;
  // studioDateAvail: Timestamp | undefined;
  studioRent: string;
  // oneBedDateAvail: Timestamp | undefined;
  oneBedRent: string;
  // twoBedDateAvail: Timestamp | undefined;
  twoBedRent: string;
  // threePlusBedDateAvail: Timestamp | undefined;
  threePlusBedRent: string;
};

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  show,
  onHide,
  onSave,
  isEditing,
  property,
}) => {
  const emptyFields: listingFormFieldsType = {
    name: "",
    address: "",
    url: "",
    startDate: "",
    endDate: "",
    lastUpdateDate: "",
    // hasAnyAvailability: undefined,
    listingId: "",
    buildingID: "",
    seduDateAvail: "",
    seduRent: "",
    // studioDateAvail: undefined,
    studioRent: "",
    // oneBedDateAvail: undefined,
    oneBedRent: "",
    // twoBedDateAvail: undefined,
    twoBedRent: "",
    // threePlusBedDateAvail: undefined,
    threePlusBedRent: "",
  };

  function clearFields(): void {
    setFormFields(emptyFields);
  }

  const [formFields, setFormFields] = useState(emptyFields);

  // event handlers
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const newFormFields = {
      ...formFields,
    };
    newFormFields[event.target.name as keyof listingFormFieldsType] =
      event.target.value;
    setFormFields(newFormFields);
  };

  const handleFormSubmit: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    return addListingFirestore(formFields)
      .then(() => {
        console.log("Message sent successfully.");
        clearFields();
      })
      .catch((error) => {
        console.error("Error sending message: ", error);
      });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? "Edit Listing" : "Add Listing"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Building Name or Address</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formFields.name}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Building Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formFields.address}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Listing URL</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={formFields.url}
              onChange={onInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Studio Availability</Form.Label>
            {/* <Form.Control
              type="date"
              name="studioDateAvail"
              value={formFields.studioDateAvail}
              onChange={onInputChange}
            /> */}
            <Form.Control
              type="text"
              name="rent"
              placeholder="Rent Amount or Range"
              value={formFields.studioRent}
              onChange={onInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleFormSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyModal;
