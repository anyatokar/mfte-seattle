import { Col, Form, Row } from "react-bootstrap";
import { AmiData } from "../interfaces/IBuilding";
import BuildingDataTable from "./BuildingDataTable";
import {
  BedroomsKeyEnum,
  TableParentEnum,
  TableTypeEnum,
} from "../types/enumTypes";
import { CurrentBuildingData } from "../interfaces/IListing";

type NotListedFormProps = {
  onClickCallback: any;
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
  const blankTable: AmiData = {
    [BedroomsKeyEnum.MICRO]: [],
    [BedroomsKeyEnum.STUDIO]: [],
    [BedroomsKeyEnum.ONE_BED]: [],
    [BedroomsKeyEnum.TWO_BED]: [],
    [BedroomsKeyEnum.THREE_PLUS]: [],
  };

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
      setCurrentBuildingData((prev) =>
        prev
          ? {
              ...prev,
              address: {
                ...prev.address,
                [name]: value,
              },
            }
          : prev
      );
    }

    if (["phone", "phone2", "urlForBuilding"].includes(name)) {
      setCurrentBuildingData((prev) =>
        prev
          ? {
              ...prev,
              contact: {
                ...prev.contact,
                [name]: value,
              },
            }
          : prev
      );
    }

    if (name === "otherBuildingName") {
      setCurrentBuildingData((prev) =>
        prev
          ? {
              ...prev,
              otherBuildingName: value,
            }
          : prev
      );
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
      <Row>
        <BuildingDataTable
          type={TableTypeEnum.amiData}
          data={blankTable}
          onClickCallback={onClickCallback}
          tableFields={amiData}
          tableParent={TableParentEnum.LISTING_CARD}
        />
      </Row>
    </>
  );
};

export default NotListedForm;
