import { useAuth } from "../../contexts/AuthContext";
import IBuilding from "../../interfaces/IBuilding";
import IListing from "../../interfaces/IListing";
import { CurrentBuildingData } from "../../interfaces/ITempBuilding";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

type EditListingFormProps = {
  currentBuildingData: CurrentBuildingData | null;
  originalListing: IListing | null;
  onInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    rowId?: string,
    buildingID?: string
  ) => void;
  allBuildings: IBuilding[];
};

const EditListingFormBuildingSelect: React.FC<EditListingFormProps> = ({
  currentBuildingData,
  originalListing,
  onInputChange,
  allBuildings,
}) => {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  // If originalListing exists and it has a actual buildingID - so not "" or null, don't render.
  if (originalListing?.buildingID) return null;

  return (
    <div className="mb-3">
      <Row className="mb-1">
        <Col md={6} className="mb-md-0">
          <Form.Label className="mb-0 fw-bold">Building name:</Form.Label>
          <Form.Select
            required
            name="buildingName"
            id="buildingName"
            onChange={(e) => {
              const selectedOption = e.target.selectedOptions[0];
              const buildingID =
                selectedOption.getAttribute("data-buildingid") || "";
              onInputChange(e, undefined, buildingID);
            }}
          >
            <option value="">Select</option>
            <option value="Not Listed">Not Listed</option>
            <Dropdown.Divider />
            {allBuildings
              .sort((a, b) => a.buildingName.localeCompare(b.buildingName))
              .map((building) => (
                <option
                  key={building.buildingID}
                  value={building.buildingName}
                  data-buildingid={building.buildingID}
                >
                  {building.buildingName}
                </option>
              ))}
          </Form.Select>
        </Col>
      </Row>
      {/* Building write in if Not Listed was selected */}
      {currentBuildingData && currentBuildingData.buildingID === "" && (
        <Row className="mb-0">
          <Col md={6}>
            <Form.Control
              autoFocus
              required
              name="otherBuildingName"
              value={currentBuildingData?.otherBuildingName}
              onChange={onInputChange}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default EditListingFormBuildingSelect;
