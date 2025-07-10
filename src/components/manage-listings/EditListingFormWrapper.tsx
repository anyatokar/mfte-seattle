import { useState } from "react";
import { setListingFirestore } from "../../utils/firestoreUtils";
import { useAuth } from "../../contexts/AuthContext";
import { useAllBuildingsContext } from "../../contexts/AllBuildingsContext";
import { useTempBuildingsContext } from "../../contexts/TempBuildingsContext";
import EditListingForm from "./EditListingForm";

import { BedroomsKeyEnum, OptionalUrlsKeyEnum } from "../../types/enumTypes";
import { EditListingFormFields } from "../../types/editListingFormFieldsType";
import { PartialWithRequired } from "../../types/partialWithRequiredType";
import IBuilding, {
  Address,
  AmiData,
  Contact,
} from "../../interfaces/IBuilding";
import IListing, {
  OptionalUrls,
  UnitAvailData,
} from "../../interfaces/IListing";
import {
  CurrentBuildingData,
  ITempBuilding,
} from "../../interfaces/ITempBuilding";

import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

type EditListingFormProps = {
  listing: IListing | null;
  building: IBuilding | ITempBuilding | null;
  onClose: () => void;
};

const blankOptionalUrls: OptionalUrls = {
  [OptionalUrlsKeyEnum.listingPageUrl]: "",
  [OptionalUrlsKeyEnum.walkTourUrl]: "",
  [OptionalUrlsKeyEnum.floorPlanUrl]: "",
  [OptionalUrlsKeyEnum.otherUrl1]: "",
  [OptionalUrlsKeyEnum.otherUrl2]: "",
};

export const createBlankAvailRow = (): UnitAvailData => ({
  unitSize: undefined,
  dateAvailString: "",
  percentAmi: undefined,
  maxRent: "",
  rowId: `${Date.now()}`,
  aptNum: "",
  selectedProgram: undefined,
  optionalUrls: blankOptionalUrls,
});

const EditListingFormWrapper: React.FC<EditListingFormProps> = ({
  listing: originalListing,
  building: buildingProp,
  onClose,
}) => {
  const [allBuildings] = useAllBuildingsContext();
  const [tempBuildings] = useTempBuildingsContext();

  const originalFormFields: EditListingFormFields = {
    buildingName: originalListing?.buildingName || "",
    buildingID: originalListing?.buildingID || "",
    availDataArray:
      originalListing?.availDataArray &&
      originalListing.availDataArray.length > 0
        ? originalListing.availDataArray
        : [createBlankAvailRow()],
    url: originalListing?.url || "",
    expiryDate: originalListing?.expiryDate || "",
    description: originalListing?.description || "",
    feedback: originalListing?.feedback || "",
    noneAvailable: originalListing?.noneAvailable || false,
  };

  const [formFields, setFormFields] = useState(originalFormFields);

  const { currentUser } = useAuth();

  const [currentBuildingData, setCurrentBuildingData] =
    useState<CurrentBuildingData | null>(buildingProp);

  if (!currentUser) return null;

  const handleInputChange = (e: any, rowId?: string, buildingID?: string) => {
    const { name, value } = e.target;

    setFormFields((prev) => {
      if (rowId !== undefined) {
        const newAvailData = [...prev.availDataArray];
        const rowIndex = newAvailData.findIndex((row) => row.rowId === rowId);

        if (Object.values(OptionalUrlsKeyEnum).includes(name)) {
          newAvailData[rowIndex] = {
            ...newAvailData[rowIndex],
            optionalUrls: {
              ...newAvailData[rowIndex].optionalUrls,
              [name]: value,
            },
          };
        } else {
          newAvailData[rowIndex] = { ...newAvailData[rowIndex], [name]: value };

          if (name === "unitSize") {
            newAvailData[rowIndex] = {
              ...newAvailData[rowIndex],
              // Clear out percentAmi when unit size changes
              percentAmi: undefined,
            };
          }

          if (name === "selectedProgram") {
            newAvailData[rowIndex] = {
              ...newAvailData[rowIndex],
            };

            delete newAvailData[rowIndex].otherProgram;
          }
        }

        return {
          ...prev,
          availDataArray: newAvailData,
        };
      }

      if (name === "buildingName") {
        if (value === "Not Listed") {
          setCurrentBuildingData({
            ...emptyCurrentBuildingData,
            buildingName: "Not Listed",
          });
        } else {
          setCurrentBuildingData(
            buildingID
              ? tempBuildings.find(
                  (building) => buildingID === building.listingID
                ) ||
                  allBuildings.find(
                    (building) => buildingID === building.buildingID
                  ) ||
                  null
              : null
          );
        }
      }

      if (name === "otherBuildingName" && currentBuildingData) {
        setCurrentBuildingData({ ...currentBuildingData, buildingName: value });
      }

      if (name === "noneAvailable") {
        return {
          ...prev,
          [name]: e.target.checked,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const [alert, setAlert] = useState<string>("");

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!formFields || !currentBuildingData) return;

    if (Object.values(currentBuildingData.amiData).flat().length === 0) {
      setAlert(
        `Please select at least one % AMI in the "All rent-reduced units" table.`
      );
      return;
    }

    setAlert("");

    const listingID = await setListingFirestore(
      formFields,
      currentBuildingData,
      currentUser.uid,
      originalListing?.listingID
    );

    if (listingID) {
      console.log(
        `Successfully set listing for building: ${currentBuildingData?.buildingName}. ListingID: ${listingID}`
      );

      onClose();
    } else {
      setAlert(
        "There was a problem submitting your data. Please contact mfte.seattle@gmail.com if the issue persists."
      );
    }
  };

  const emptyAddressCurrentBuildingData: PartialWithRequired<
    Address,
    "streetAddress" | "zip" | "neighborhood"
  > = {
    streetAddress: "",
    zip: "",
    neighborhood: "",
  };

  const emptyContactCurrentBuildingData: PartialWithRequired<
    Contact,
    "phone" | "urlForBuilding"
  > = {
    phone: "",
    urlForBuilding: "",
  };

  const blankTable: AmiData = {
    [BedroomsKeyEnum.MICRO]: [],
    [BedroomsKeyEnum.STUDIO]: [],
    [BedroomsKeyEnum.ONE_BED]: [],
    [BedroomsKeyEnum.TWO_BED]: [],
    [BedroomsKeyEnum.THREE_PLUS]: [],
  };

  const emptyCurrentBuildingData: CurrentBuildingData = {
    buildingName: "",
    buildingID: "",
    address: emptyAddressCurrentBuildingData,
    contact: emptyContactCurrentBuildingData,
    amiData: blankTable,
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {!originalListing?.buildingID && (
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
                  handleInputChange(e, undefined, buildingID);
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
          {currentBuildingData && currentBuildingData.buildingID === "" && (
            <Row className="mb-0">
              <Col md={6}>
                <Form.Control
                  autoFocus
                  required
                  name="otherBuildingName"
                  value={currentBuildingData?.otherBuildingName}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          )}
        </div>
      )}

      <EditListingForm
        alert={alert}
        currentBuildingData={currentBuildingData}
        formFields={formFields}
        setFormFields={setFormFields}
        setCurrentBuildingData={setCurrentBuildingData}
        onInputChange={handleInputChange}
      />
    </Form>
  );
};

export default EditListingFormWrapper;
