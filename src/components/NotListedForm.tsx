import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Address, AmiData, Contact } from "../interfaces/IBuilding";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import BuildingDataTable from "./BuildingDataTable";
import { BedroomsKeyEnum, TableTypeEnum } from "../types/enumTypes";

type NotListedFormProps = {
  onClickCallback: any;
  amiDataFields: AmiData;
};
const NotListedForm: React.FC<NotListedFormProps> = ({
  onClickCallback,
  amiDataFields,
}): JSX.Element => {
  const emptyAddressFormFields: PartialWithRequired<
    Address,
    "streetAddress" | "zip" | "neighborhood"
  > = {
    streetAddress: "",
    zip: "",
    neighborhood: "",
  };

  const emptyContactFormFields: PartialWithRequired<
    Contact,
    "phone" | "urlForBuilding"
  > = {
    phone: "",
    urlForBuilding: "",
  };

  type FormFields = {
    buildingName: string;
    address: PartialWithRequired<
      Address,
      "streetAddress" | "zip" | "neighborhood" | "neighborhood"
    >;
    contact: PartialWithRequired<Contact, "phone" | "urlForBuilding">;
    amiData: AmiData;
  };

  // TODO: This gets overwritten... needs a refactor
  const blankTable: AmiData = {
    [BedroomsKeyEnum.MICRO]: [],
    [BedroomsKeyEnum.STUDIO]: [],
    [BedroomsKeyEnum.ONE_BED]: [],
    [BedroomsKeyEnum.TWO_BED]: [],
    [BedroomsKeyEnum.THREE_PLUS]: [],
  };

  const emptyFormFields: FormFields = {
    buildingName: "",
    address: emptyAddressFormFields,
    contact: emptyContactFormFields,
    amiData: blankTable,
  };

  const [formFields, setFormFields] = useState(emptyFormFields);

  // const [zip, setZip] = useState("");
  // const handleChange = (e) => {
  //   const newValue = e.target.value;
  //   if (/^\d{0,5}$/.test(newValue)) {
  //     // Allows only 5 digits
  //     setZip(newValue);
  //   }
  // };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    if (["streetAddress", "zip", "neighborhood", "district"].includes(name)) {
      setFormFields((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    }

    if (["phone", "urlForBuilding"].includes(name)) {
      setFormFields((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [name]: value,
        },
      }));
    }

    if (name === "buildingName") {
      setFormFields((prev) => ({
        ...prev,
        buildingName: value,
      }));
    }
  };

  return (
    <>
      <h5>Add new building</h5>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Label className="mb-0">Building name</Form.Label>
          <Form.Control
            name="buildingName"
            value={formFields.buildingName}
            onChange={handleInputChange}
          />
        </Col>
      </Row>
      <Form.Label className="mb-0 fw-bold">Address</Form.Label>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Label className="mb-0">District</Form.Label>
          <Form.Control
            name="neighborhood"
            value={formFields.address.neighborhood}
            onChange={handleInputChange}
          />
          <Form.Text>e.g. Capitol Hill</Form.Text>
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Label className="mb-0">Street address</Form.Label>
          <Form.Control
            name="streetAddress"
            value={formFields.address.streetAddress}
            onChange={handleInputChange}
          />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={3}>
          <Form.Label className="mb-0">City, State</Form.Label>
          <Form.Control disabled value="Seattle, WA" />
        </Col>
        <Col md={3}>
          <Form.Label className="mb-0">Zip</Form.Label>
          <Form.Control
            type="text"
            value={formFields.address.zip}
            onChange={handleInputChange}
            inputMode="numeric"
            name="zip"
          />
        </Col>
      </Row>

      <Form.Label className="mb-0 fw-bold">Contact</Form.Label>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label className="mb-0">Website</Form.Label>
          <Form.Control
            value={formFields.contact.urlForBuilding}
            onChange={handleInputChange}
            name="urlForBuilding"
          />
          <Form.Text>General website for the building.</Form.Text>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label className="mb-0">Phone</Form.Label>
          <Form.Control
            value={formFields.contact.phone || ""}
            onChange={handleInputChange}
            name="phone"
          />
        </Col>
        <Form.Text>Phone number to ask about rent-reduced units.</Form.Text>
      </Row>

      <Form.Label className="mb-0 fw-bold">All rent-reduced units</Form.Label>
      <br />
      <Form.Text>Regardless of availability.</Form.Text>
      <Row className="mb-3">
        <BuildingDataTable
          type={TableTypeEnum.amiData}
          data={blankTable}
          onClickCallback={onClickCallback}
          tableFields={amiDataFields}
        />
      </Row>
    </>
  );
};

export default NotListedForm;
