import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import { BedroomsKeyEnum, OptionalUrlsKeyEnum } from "../types/enumTypes";
import { setListingFirestore } from "../utils/firestoreUtils";
import { getMaxExpiryDate } from "../utils/generalUtils";
import { useAuth } from "../contexts/AuthContext";
import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { useTempBuildingsContext } from "../contexts/TempBuildingsContext";
import ListingCardBuildingData from "./ListingCardBuildingData";
import NotListedForm from "./NotListedForm";
import IBuilding, {
  Address,
  AmiData,
  Contact,
  PercentAmi,
} from "../interfaces/IBuilding";
import IListing, {
  AvailDataArray,
  OptionalUrls,
  UnitAvailData,
} from "../interfaces/IListing";
import {
  CurrentBuildingData,
  ITempBuilding,
} from "../interfaces/ITempBuilding";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import AvailUnitsTable from "./AvailUnitsTable";

export type EditListingFormFields = PartialWithRequired<
  IListing,
  | "buildingName"
  | "buildingID"
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "description"
  | "feedback"
  | "noneAvailable"
>;

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

const EditListingForm: React.FC<EditListingFormProps> = ({
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

  function updateAvailRow(unit: BedroomsKeyEnum, ami: PercentAmi) {
    if (!formFields.availDataArray) return;

    const updatedAvailDataArray: AvailDataArray = [];

    for (const row of formFields.availDataArray) {
      let updatedRow = { ...row };

      if (row.unitSize === unit) {
        if (
          currentBuildingData &&
          Object.keys(currentBuildingData.amiData[unit]).length <= 1
        ) {
          updatedRow = { ...row, unitSize: undefined, percentAmi: undefined };
        } else if (row.percentAmi === ami) {
          updatedRow = { ...row, percentAmi: undefined };
        }

        updatedAvailDataArray.push(updatedRow);
      } else {
        updatedAvailDataArray.push(row);
      }
    }

    setFormFields((prev) => ({
      ...prev,
      availDataArray: [...updatedAvailDataArray],
    }));
  }

  // Would be way simpler if Amis were a set but Firestore doesn't store the data type
  function handleToggleAmi(
    ami: PercentAmi,
    unit: BedroomsKeyEnum,
    isChecked: boolean
  ) {
    if (isChecked) {
      setCurrentBuildingData((prev) =>
        prev
          ? {
              ...prev,
              amiData: {
                ...prev.amiData,
                [unit]: prev.amiData[unit].filter((item) => item !== ami),
              },
            }
          : prev
      );

      updateAvailRow(unit, ami);
    } else {
      setCurrentBuildingData((prev) =>
        prev
          ? {
              ...prev,
              amiData: {
                ...prev.amiData,
                [unit]: prev.amiData[unit]?.includes(ami)
                  ? prev.amiData[unit]
                  : // Buildings collection doesn't store empty arrays for units without AMIs.
                    [...(prev.amiData[unit] || []), ami],
              },
            }
          : prev
      );
    }
  }

  const [showEditBuildingData, setShowEditBuildingData] = useState(
    currentBuildingData && !currentBuildingData.buildingID
  );

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

      {/* Address */}
      {/* New form, existing building */}
      {currentBuildingData && (
        <>
          {/* New form, new building */}
          <Row className="mb-3">
            <Col md={8}>
              <Card>
                <Card.Body>
                  {showEditBuildingData || !currentBuildingData.buildingID ? (
                    <Row className="mb-3">
                      <Col className="mb-md-0">
                        <NotListedForm
                          onClickCallback={handleToggleAmi}
                          amiData={currentBuildingData.amiData}
                          setCurrentBuildingData={setCurrentBuildingData}
                          currentBuildingData={currentBuildingData}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <Row className="mb-3">
                        <Col className="mb-md-0">
                          <ListingCardBuildingData
                            // TODO: remove CurrentBuildingData type and just use temp building interface?
                            building={currentBuildingData}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {currentBuildingData.buildingID !== "" && (
                    <Row>
                      <Col className="mb-md-0">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() =>
                            setShowEditBuildingData((prev) => !prev)
                          }
                        >
                          {showEditBuildingData ? "Cancel" : "Edit"}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col className="mb-0">
              <Form.Label className="mb-0 fw-bold">Available units:</Form.Label>

              <Form.Check
                type="switch"
                id="noneAvailableSwitch"
                name="noneAvailable"
                label="No units available"
                checked={formFields.noneAvailable}
                onChange={handleInputChange}
              />

              {/* URL */}
              {!formFields.noneAvailable && (
                <Row className="my-3">
                  <Col md={8} lg={6} className="mb-0">
                    <Form.Label className="mb-0 fw-bold">
                      All listings URL:
                    </Form.Label>
                    <Form.Control
                      required
                      type="url"
                      name="url"
                      onChange={handleInputChange}
                      value={formFields.url}
                    />
                    <Form.Text>
                      {`URL to view available rent-reduced units. Include http://`}
                    </Form.Text>
                  </Col>
                </Row>
              )}

              {!formFields.noneAvailable && (
                <AvailUnitsTable
                  currentBuildingData={currentBuildingData}
                  formFields={formFields}
                  setFormFields={setFormFields}
                  handleInputChange={handleInputChange}
                />
              )}
            </Col>
          </Row>

          {/* Expiry Date */}
          <Row className="mb-3">
            <Form.Label className="mb-0 fw-bold">
              Listing expiration date:
            </Form.Label>
            <Col xs={6} md={4} lg={3} className="mb-0">
              <Form.Control
                type="date"
                name="expiryDate"
                value={formFields.expiryDate || ""}
                max={getMaxExpiryDate()}
                onChange={handleInputChange}
              />
            </Col>
            <Form.Text>
              Optional. Up to 60 days. If left blank will be set to the max of
              60 days.
            </Form.Text>
          </Row>

          <Row className="mb-3">
            <Col className="mb-0">
              <Form.Label className="mb-0 fw-bold">
                Featured description:
              </Form.Label>

              <Form.Control
                as="textarea"
                name="description"
                id="description"
                rows={3}
                onChange={handleInputChange}
                value={formFields.description}
                maxLength={200}
              />
              <Form.Text>
                Optional. Will be shared as part of the listing. Max 200
                characters.
              </Form.Text>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col className="mb-0">
              <Form.Label className="mb-0 fw-bold">Form feedback:</Form.Label>
              <Form.Control
                as="textarea"
                name="feedback"
                id="feedback"
                rows={3}
                onChange={handleInputChange}
                value={formFields.feedback}
              />
              <Form.Text>
                Optional. Will not be shared publicly. Feedback can include data
                corrections, suggestions for form improvement, user experience,
                etc. Thank you!
              </Form.Text>
            </Col>
          </Row>
          {alert && <Alert variant="danger">{alert}</Alert>}
          <Form.Group className="text-end">
            <Button variant="success" type="submit">
              Submit
            </Button>
          </Form.Group>
        </>
      )}
    </Form>
  );
};

export default EditListingForm;
