import React, { useState, useEffect, ChangeEvent } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import IListing from "../interfaces/IListing";
import IListingAptDetails from "../interfaces/IListingAptDetails";
import { Timestamp } from "firebase/firestore";

interface AddPropertyModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (property: IListing) => void;
  isEditing: boolean;
  property: Partial<IListing> | null;
}

const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  show,
  onHide,
  onSave,
  isEditing,
  property,
}) => {
  const [currentProperty, setCurrentProperty] = useState<Partial<IListing>>(
    property || {}
  );

  useEffect(() => {
    if (property) {
      setCurrentProperty(property);
    }
  }, [property]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof Partial<IListing>
  ) => {
    const { name, value } = e.target;
    setCurrentProperty((prevProperty) => ({
      ...prevProperty,
      [key]: value,
    }));
  };

  const handleAptDetailsChange = (
    e: ChangeEvent<HTMLInputElement>,
    unitType: keyof Partial<IListing>
  ) => {
    const { name, value } = e.target;
    setCurrentProperty((prevProperty) => ({
      ...prevProperty,
      [unitType]: {
        ...prevProperty[unitType] as IListingAptDetails,
        [name]: name === "dateAvail" ? new Timestamp(Math.floor(new Date(value).getTime() / 1000), 0) : value,
      },
    }));
  };

  const handleSave = () => {
    onSave(currentProperty as IListing);
    onHide();
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
              value={currentProperty.name || ""}
              onChange={(e) => handleChange(e, "name")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Building Address</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={currentProperty.address || ""}
              onChange={(e) => handleChange(e, "address")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Listing URL</Form.Label>
            <Form.Control
              type="text"
              name="url"
              value={currentProperty.url || ""}
              onChange={(e) => handleChange(e, "url")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={currentProperty.startDate || ""}
              onChange={(e) => handleChange(e, "startDate")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={currentProperty.endDate || ""}
              onChange={(e) => handleChange(e, "endDate")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last Update Date</Form.Label>
            <Form.Control
              type="date"
              name="lastUpdateDate"
              value={currentProperty.lastUpdateDate || ""}
              onChange={(e) => handleChange(e, "lastUpdateDate")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Studio Availability</Form.Label>
            <Form.Control
              type="date"
              name="dateAvail"
              value={currentProperty.studioAvail?.dateAvail.toDate().toISOString().substring(0, 10) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "studioAvail")}
            />
            <Form.Control
              type="text"
              name="rent"
              placeholder="Rent Amount or Range"
              value={currentProperty.studioAvail?.rent || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "studioAvail")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>1 Bedroom Availability</Form.Label>
            <Form.Control
              type="date"
              name="dateAvail"
              value={currentProperty.oneBedAvail?.dateAvail.toDate().toISOString().substring(0, 10) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "oneBedAvail")}
            />
            <Form.Control
              type="text"
              name="rent"
              placeholder="Rent Amount or Range"
              value={currentProperty.oneBedAvail?.rent || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "oneBedAvail")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>2 Bedroom Availability</Form.Label>
            <Form.Control
              type="date"
              name="dateAvail"
              value={currentProperty.twoBedAvail?.dateAvail.toDate().toISOString().substring(0, 10) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "twoBedAvail")}
            />
            <Form.Control
              type="text"
              name="rent"
              placeholder="Rent Amount or Range"
              value={currentProperty.twoBedAvail?.rent || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "twoBedAvail")}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>3+ Bedroom Availability</Form.Label>
            <Form.Control
              type="date"
              name="dateAvail"
              value={currentProperty.threePlusBedAvail?.dateAvail.toDate().toISOString().substring(0, 10) || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "threePlusBedAvail")}
            />
            <Form.Control
              type="text"
              name="rent"
              placeholder="Rent Amount or Range"
              value={currentProperty.threePlusBedAvail?.rent || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleAptDetailsChange(e, "threePlusBedAvail")}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPropertyModal;
