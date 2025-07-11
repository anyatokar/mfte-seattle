import { Col, Form, Row } from "react-bootstrap";
import { AmiData, PercentAmi } from "../../interfaces/IBuilding";
import BuildingDataTable from "../shared/BuildingDataTable";
import {
  BedroomsKeyEnum,
  TableParentEnum,
  TableTypeEnum,
} from "../../types/enumTypes";
import { CurrentBuildingData } from "../../interfaces/ITempBuilding";
import { createBlankTable } from "../../constants/listingDefaults";

type NotListedFormProps = {
  onClickCallback: (
    ami: PercentAmi,
    unit: BedroomsKeyEnum,
    isChecked: boolean
  ) => void;
  amiData: AmiData;
  setCurrentBuildingData: React.Dispatch<
    React.SetStateAction<CurrentBuildingData | null>
  >;
  currentBuildingData: CurrentBuildingData;
};

const NotListedForm: React.FC<NotListedFormProps> = ({
  onClickCallback,
  amiData,
  setCurrentBuildingData,
  currentBuildingData,
}): JSX.Element => {
  // TODO: This gets overwritten... needs a refactor
  const blankTable = createBlankTable();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (["streetAddress", "zip", "neighborhood", "district"].includes(name)) {
      setCurrentBuildingData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          address: {
            ...prev.address,
            [name]: value,
          },
        };
      });
    }

    if (["phone", "phone2", "urlForBuilding"].includes(name)) {
      setCurrentBuildingData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [name]: value,
          },
        };
      });
    }

    if (name === "otherBuildingName") {
      setCurrentBuildingData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          otherBuildingName: value,
        };
      });
    }

    if (name === "isAgeRestricted") {
      setCurrentBuildingData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isAgeRestricted: !prev.isAgeRestricted,
        };
      });
    }
  };

  return (
    <>
      <Form.Label className="mb-0 fw-bold">District:</Form.Label>
      <Row className="mb-2">
        <Col md={8}>
          <Form.Control
            required
            name="neighborhood"
            value={currentBuildingData.address.neighborhood}
            onChange={handleInputChange}
          />
          <Form.Text>e.g. Capitol Hill</Form.Text>
        </Col>
      </Row>
      <Form.Label className="mb-0 fw-bold">Address:</Form.Label>
      <Row className="mb-2">
        <Col md={8}>
          <Form.Label className="mb-0">Street address</Form.Label>
          <Form.Control
            required
            name="streetAddress"
            value={currentBuildingData.address.streetAddress}
            onChange={handleInputChange}
          />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col sm={4} className="mb-2">
          <Form.Label className="mb-0">City, State</Form.Label>
          <Form.Control disabled value="Seattle, WA" />
        </Col>
        <Col sm={3}>
          <Form.Label className="mb-0">Zip</Form.Label>
          <Form.Control
            required
            type="text"
            value={currentBuildingData.address.zip}
            onChange={handleInputChange}
            inputMode="numeric"
            name="zip"
          />
        </Col>
      </Row>

      <Form.Label className="mb-0 fw-bold">Contact:</Form.Label>
      <Row className="mb-3">
        <Col md={10}>
          <Form.Label className="mb-0">Website</Form.Label>
          <Form.Control
            required
            value={currentBuildingData.contact.urlForBuilding}
            onChange={handleInputChange}
            name="urlForBuilding"
            type="url"
          />
          <Form.Text>General website for the building.</Form.Text>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Label className="mb-0">Phone</Form.Label>
          <Form.Control
            required
            value={currentBuildingData.contact.phone || ""}
            onChange={handleInputChange}
            name="phone"
          />
        </Col>
        <Form.Text>Phone number to ask about rent-reduced units.</Form.Text>
      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Label className="mb-0">Secondary phone</Form.Label>
          <Form.Control
            value={currentBuildingData.contact.phone2 || ""}
            onChange={handleInputChange}
            name="phone2"
          />
        </Col>
      </Row>

      <Form.Label className="mb-0 fw-bold">All rent-reduced units:</Form.Label>
      <br />
      <Form.Text>Regardless of availability.</Form.Text>
      <Row className="mb-3">
        <Col>
          <BuildingDataTable
            type={TableTypeEnum.amiData}
            data={blankTable}
            onClickCallback={onClickCallback}
            tableFields={amiData}
            tableParent={TableParentEnum.LISTING_CARD}
          />
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-center gap-1">
          <Form.Check
            type="checkbox"
            id="isAgeRestricted"
            name="isAgeRestricted"
            checked={currentBuildingData.isAgeRestricted || false}
            onChange={handleInputChange}
          />
          <Form.Label className="mb-0 fw-bold">Age-restricted community</Form.Label>
        </Col>
      </Row>
    </>
  );
};

export default NotListedForm;
