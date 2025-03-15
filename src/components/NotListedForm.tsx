import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { Address, AmiData, Contact, PercentAmi } from "../interfaces/IBuilding";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import BuildingDataTable from "./BuildingDataTable";
import { BedroomsKeyEnum, TableTypeEnum } from "../types/enumTypes";

const NotListedForm: React.FC = (): JSX.Element => {
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

  // const [buildingName, setBuildingName] = useState("");
  // const [addressFormFields, setAddressFormFields] = useState(
  //   emptyAddressFormFields
  // );
  // const [contactFormFields, setContactFormFields] = useState(
  //   emptyContactFormFields
  // );

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

  const blankTable2: Record<BedroomsKeyEnum, Set<PercentAmi>> = {
    [BedroomsKeyEnum.MICRO]: new Set(),
    [BedroomsKeyEnum.STUDIO]: new Set(),
    [BedroomsKeyEnum.ONE_BED]: new Set(),
    [BedroomsKeyEnum.TWO_BED]: new Set(),
    [BedroomsKeyEnum.THREE_PLUS]: new Set(),
  };

  const [tableFields, setTableFields] = useState(blankTable2);

  function handleToggleAmi(
    ami: PercentAmi,
    unit: BedroomsKeyEnum,
    isChecked: boolean
  ) {
    if (isChecked) {
      setTableFields((prev) => ({
        ...prev,
        [unit]: prev[unit].delete(ami),
      }));
    } else {
      setTableFields((prev) => ({
        ...prev,
        [unit]: prev[unit].add(ami),
      }));
    }
  }

  return (
    <>
      <h6>Address</h6>
      <Row className="mb-2">
        <Col md={6}>
          <Form.Label className="mb-0">Building Name</Form.Label>
          <Form.Control
            name="buildingName"
            value={formFields.buildingName}
            onChange={handleInputChange}
          />
        </Col>
      </Row>
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

      <h6>Contact</h6>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Label className="mb-0">Website</Form.Label>
          <Form.Control
            value={formFields.contact.urlForBuilding}
            onChange={handleInputChange}
            name="urlForBuilding"
          />
        </Col>
        <Col md={3}>
          <Form.Label className="mb-0">Phone</Form.Label>
          <Form.Control
            value={formFields.contact.phone || ""}
            onChange={handleInputChange}
            name="phone"
          />
        </Col>
      </Row>

      <h6 className="mb-0">All rent-reduced units</h6>
      <Form.Text>
        Breakdown of all rent-reduced units in the building regardless of
        availability
      </Form.Text>
      <Row className="mb-3">
        <BuildingDataTable
          type={TableTypeEnum.amiData}
          data={blankTable}
          isMarker={false}
          onClickCallback={handleToggleAmi}
          tableFields={tableFields}
        />
      </Row>
    </>
  );
};

export default NotListedForm;
