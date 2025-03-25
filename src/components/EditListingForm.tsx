import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  ProgramKeyEnum,
  ProgramLabelEnum,
  OptionalUrlsKeyEnum,
} from "../types/enumTypes";
import {
  addListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { formatCurrency, getMaxExpiryDate } from "../utils/generalUtils";
import { useAuth } from "../contexts/AuthContext";
import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { colWidths, optionalUrlsArray } from "../config/constants";
import { p6UnitPricing } from "../config/P6-unit-pricing";
import { p345UnitPricing } from "../config/P345-unit-pricing";

import ListingCardBuildingData from "./ListingCardBuildingData";
import NotListedForm from "./NotListedForm";
import { Trash } from "react-bootstrap-icons";

import IBuilding, {
  Address,
  AmiData,
  Contact,
  PercentAmi,
} from "../interfaces/IBuilding";
import IListing, {
  AvailDataArray,
  OptionalUrls,
  SelectedBuilding,
  UnitAvailData,
} from "../interfaces/IListing";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/esm/Stack";
import Table from "react-bootstrap/Table";

export type EditListingFormFields = PartialWithRequired<
  IListing,
  | "buildingName"
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "description"
  | "feedback"
>;

type EditListingFormProps = {
  listing: EditListingFormFields | null;
  onClose: () => void;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  listing,
  onClose,
}) => {
  const blankOptionalUrls: OptionalUrls = {
    [OptionalUrlsKeyEnum.listingPageUrl]: "",
    [OptionalUrlsKeyEnum.walkTourUrl]: "",
    [OptionalUrlsKeyEnum.floorPlanUrl]: "",
    [OptionalUrlsKeyEnum.otherUrl1]: "",
    [OptionalUrlsKeyEnum.otherUrl2]: "",
  };

  const blankAvailRow: UnitAvailData = {
    unitSize: undefined,
    dateAvailString: "",
    percentAmi: undefined,
    maxRent: "",
    rowId: `${Date.now()}`,
    aptNum: "",
    selectedProgram: undefined,
    optionalUrls: blankOptionalUrls,
  };

  const originalFormFields: EditListingFormFields = listing
    ? {
        buildingName: listing.buildingName,
        availDataArray: listing.availDataArray,
        url: listing.url,
        expiryDate: listing.expiryDate,
        description: listing.description,
        feedback: listing.feedback,
      }
    : {
        buildingName: "",
        availDataArray: [blankAvailRow],
        url: "",
        expiryDate: "",
        description: "",
        feedback: "",
      };

  const [formFields, setFormFields] = useState(originalFormFields);

  const { currentUser } = useAuth();

  const [allBuildings] = useAllBuildingsContext();

  const [selectedBuilding, setSelectedBuilding] = useState<
    SelectedBuilding | undefined
  >(findSelectedBuilding(listing?.buildingName));

  if (!currentUser) return null;

  const handleAddRow = (isDuplicate: boolean) => {
    const newRow = isDuplicate
      ? {
          ...formFields.availDataArray[formFields.availDataArray.length - 1],
          rowId: `${Date.now()}`,
        }
      : {
          ...blankAvailRow,
        };

    const newAvailDataArray = [...(formFields.availDataArray || []), newRow];

    setFormFields({
      ...formFields,
      availDataArray: newAvailDataArray,
    });
  };

  const handleDeleteRow = (rowId: string) => {
    if (!formFields.availDataArray) return;

    const newAvailDataArray = formFields.availDataArray.filter(
      (row) => row.rowId !== rowId
    );

    setFormFields({
      ...formFields,
      availDataArray: newAvailDataArray,
    });
  };

  function findSelectedBuilding(
    buildingName: string | undefined
  ): IBuilding | undefined {
    if (buildingName === undefined) {
      return undefined;
    }

    return allBuildings.find(
      (building) => buildingName === building.buildingName
    );
  }

  const handleInputChange = (e: any, rowId?: string) => {
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
      } else {
        const update = { [name]: value } as EditListingFormFields;
        if (name === "buildingName") {
          if (value === "Not Listed") {
            setSelectedBuilding(emptySelectedBuilding);
          } else {
            // This assumes building names are unique.
            setSelectedBuilding(findSelectedBuilding(value));
          }
        }

        return {
          ...prev,
          ...update,
        };
      }
    });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!formFields) return;

    if (!listing?.listingID) {
      const listingID = await addListingFirestore(
        formFields,
        selectedBuilding,
        currentUser.uid
      );
      if (listingID) {
        console.log(
          `Successfully added listing for ${selectedBuilding?.buildingName}. ListingID: ${listingID}`
        );

        // Close modal
        onClose();
      }
    } else {
      const isSuccessful = await updateListingFirestore(
        formFields,
        listing.listingID
      );
      if (isSuccessful) {
        console.log(
          `Successfully updated listing for ${selectedBuilding?.buildingName}, listingID: ${listing.listingID || ""}`
        );

        onClose();
      }
    }
  };

  const emptyAddressSelectedBuilding: PartialWithRequired<
    Address,
    "streetAddress" | "zip" | "neighborhood"
  > = {
    streetAddress: "",
    zip: "",
    neighborhood: "",
  };

  const emptyContactSelectedBuilding: PartialWithRequired<
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

  const emptySelectedBuilding: SelectedBuilding = {
    buildingName: "",
    buildingID: "",
    address: emptyAddressSelectedBuilding,
    contact: emptyContactSelectedBuilding,
    amiData: blankTable,
  };

  function updateAvailRow(unit: BedroomsKeyEnum, ami: PercentAmi) {
    if (!formFields.availDataArray) return;
    const updatedAvailDataArray: AvailDataArray = [];

    for (const row of formFields.availDataArray) {
      let updatedRow = { ...row };

      if (row.unitSize === unit) {
        if (
          selectedBuilding &&
          Object.keys(selectedBuilding.amiData[unit]).length <= 1
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
      setSelectedBuilding((prev) =>
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
      setSelectedBuilding((prev) =>
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

  const availSizes: BedroomsKeyEnum[] = selectedBuilding?.amiData
    ? (Object.keys(selectedBuilding.amiData) as BedroomsKeyEnum[]).filter(
        (key) => {
          return selectedBuilding.amiData[key].length > 0;
        }
      )
    : [];

  function getMaxRent(unitAvailData: UnitAvailData): number {
    const { unitSize, percentAmi, selectedProgram } = unitAvailData;

    if (!unitSize || !percentAmi || !selectedProgram) return 0;

    if (unitAvailData.unitSize && unitAvailData.percentAmi) {
      if (selectedProgram === ProgramKeyEnum.P6) {
        return p6UnitPricing[unitSize][percentAmi];
      } else {
        return p345UnitPricing[unitSize][percentAmi];
      }
    }

    return 0;
  }

  const [showEditBuildingData, setShowEditBuildingData] = useState(
    selectedBuilding && !selectedBuilding.buildingID
  );

  const programOptionsArray: ProgramKeyEnum[] = [
    ProgramKeyEnum.P6,
    ProgramKeyEnum.P345,
    ProgramKeyEnum.other,
  ];

  return (
    <Form onSubmit={handleFormSubmit}>
      {!listing?.buildingID && (
        <Row className="mb-3">
          <Col md={6} className="mb-md-0">
            <Form.Label>Select building</Form.Label>
            <Form.Select
              required
              name="buildingName"
              id="buildingName"
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Not Listed">Not Listed</option>
              <Dropdown.Divider />
              {allBuildings
                .sort((a, b) => a.buildingName.localeCompare(b.buildingName))
                .map((selectedBuilding) => (
                  <option
                    key={selectedBuilding.buildingID}
                    value={selectedBuilding.buildingName}
                  >
                    {selectedBuilding.buildingName}
                  </option>
                ))}
            </Form.Select>
          </Col>
        </Row>
      )}

      {/* Address */}
      {/* TODO: Maybe show address for existing listing */}
      {/* New form, existing building */}
      {selectedBuilding && (
        <>
          {/* New form, new building */}
          <Row className="mb-3">
            <Col md={8}>
              <Card>
                <Card.Body>
                  {showEditBuildingData ||
                  selectedBuilding.buildingID === "" ? (
                    <Row className="mb-3">
                      <Col className="mb-md-0">
                        <NotListedForm
                          onClickCallback={handleToggleAmi}
                          amiData={selectedBuilding.amiData}
                          setSelectedBuilding={setSelectedBuilding}
                          selectedBuilding={selectedBuilding}
                        />
                      </Col>
                    </Row>
                  ) : (
                    <>
                      <Row className="mb-3">
                        <Col className="mb-md-0">
                          <ListingCardBuildingData
                            buildingID={selectedBuilding.buildingID}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                  {selectedBuilding.buildingID !== "" && (
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

          {/* URL */}
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
                {`Url to view available rent-reduced units. Often ends with /floorplans`}
                <br />
                {`Include http://`}
              </Form.Text>
            </Col>
          </Row>

          {/* Table */}
          <Row className="mb-3">
            <Row>
              <Col className="mb-0">
                <Form.Label className="mb-0 fw-bold">
                  Available units:
                </Form.Label>
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th></th>
                      <th style={{ minWidth: colWidths.unitSize }}>Size</th>
                      <th style={{ minWidth: colWidths.percentAmi }}>% AMI</th>
                      <th style={{ minWidth: colWidths.program }}>Program</th>
                      <th style={{ minWidth: colWidths.rent }}>Rent</th>
                      <th style={{ minWidth: colWidths.aptNum }}>Apt #</th>
                      <th style={{ minWidth: colWidths.dateAvail }}>
                        Move-in Date
                      </th>

                      {optionalUrlsArray.map(({ key, label }) => (
                        <th key={key} style={{ minWidth: colWidths.links }}>
                          {label}
                          <div>
                            <Form.Text>Optional</Form.Text>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {formFields.availDataArray?.map((unitAvailData) => (
                      <tr key={unitAvailData.rowId}>
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            onClick={() => handleDeleteRow(unitAvailData.rowId)}
                            disabled={
                              formFields.availDataArray
                                ? formFields.availDataArray.length <= 1
                                : true
                            }
                          >
                            <Trash size={20} />
                          </Button>
                        </td>
                        <td>
                          <Form.Select
                            required
                            name="unitSize"
                            id="unitSize"
                            onChange={(e) =>
                              handleInputChange(e, unitAvailData.rowId)
                            }
                            disabled={
                              selectedBuilding &&
                              Object.values(selectedBuilding.amiData).flat()
                                .length === 0
                            }
                            value={unitAvailData.unitSize || ""}
                          >
                            <option value="" disabled></option>
                            {availSizes.map((unitSize) => (
                              <option key={unitSize} value={unitSize}>
                                {unitSizeLabelEnum[unitSize]}
                              </option>
                            ))}
                          </Form.Select>
                        </td>

                        {/* AMI */}
                        <td>
                          <Form.Select
                            required
                            name="percentAmi"
                            id="percentAmi"
                            onChange={(e) =>
                              handleInputChange(e, unitAvailData.rowId)
                            }
                            disabled={!unitAvailData.unitSize}
                            value={unitAvailData.percentAmi || ""}
                          >
                            <option value="" disabled></option>
                            {selectedBuilding.amiData?.[
                              unitAvailData.unitSize as BedroomsKeyEnum
                            ]?.map((percentAmi) => (
                              <option key={percentAmi} value={percentAmi}>
                                {percentAmi}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td style={{ maxWidth: colWidths.program }}>
                          <Row>
                            <Col>
                              <Form.Select
                                required
                                name="selectedProgram"
                                id="selectedProgram"
                                onChange={(e) =>
                                  handleInputChange(e, unitAvailData.rowId)
                                }
                                value={unitAvailData.selectedProgram || ""}
                              >
                                <option value="">Select</option>
                                {programOptionsArray.map((program) => (
                                  <option
                                    key={program}
                                    label={ProgramLabelEnum[program]}
                                    id={program}
                                    value={program}
                                  />
                                ))}
                              </Form.Select>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              {unitAvailData.selectedProgram ===
                                ProgramKeyEnum.other && (
                                <Form.Control
                                  required
                                  name="otherProgram"
                                  onChange={(e) =>
                                    handleInputChange(e, unitAvailData.rowId)
                                  }
                                  value={unitAvailData.otherProgram}
                                />
                              )}
                            </Col>
                          </Row>
                        </td>
                        <td style={{ maxWidth: colWidths.rent }}>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              required
                              type="number"
                              min="1"
                              name="maxRent"
                              value={unitAvailData.maxRent}
                              onChange={(e) =>
                                handleInputChange(e, unitAvailData.rowId)
                              }
                            />
                          </InputGroup>
                          <div className="text-end">
                            <Form.Text>
                              {!!getMaxRent(unitAvailData) &&
                                unitAvailData.selectedProgram &&
                                unitAvailData.selectedProgram !==
                                  ProgramKeyEnum.other &&
                                `${ProgramLabelEnum[unitAvailData.selectedProgram]}, 
                              ${unitSizeLabelEnum[unitAvailData.unitSize as BedroomsKeyEnum]}, 
                              ${unitAvailData.percentAmi}% AMI ⟶ 
                              ${formatCurrency(getMaxRent(unitAvailData))} max with utilities*`}
                            </Form.Text>
                          </div>
                        </td>
                        <td style={{ maxWidth: colWidths.aptNum }}>
                          <Form.Control
                            required
                            type="string"
                            name="aptNum"
                            value={unitAvailData.aptNum}
                            onChange={(e) =>
                              handleInputChange(e, unitAvailData.rowId)
                            }
                          />
                        </td>
                        <td style={{ maxWidth: colWidths.dateAvail }}>
                          <Form.Control
                            required
                            type="date"
                            name="dateAvailString"
                            value={unitAvailData.dateAvailString || ""}
                            onChange={(e) =>
                              handleInputChange(e, unitAvailData.rowId)
                            }
                          />
                        </td>
                        {/* Optional URLs */}
                        {optionalUrlsArray.map(({ key }) => (
                          <td key={key}>
                            <Form.Control
                              type="url"
                              name={key}
                              onChange={(e) =>
                                handleInputChange(e, unitAvailData.rowId)
                              }
                              value={unitAvailData.optionalUrls?.[key] || ""}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col className="d-flex justify-content-end">
                <Stack direction={"horizontal"} gap={2} className="ms-auto">
                  <Button onClick={() => handleAddRow(true)}>
                    Duplicate Last Row
                  </Button>
                  <Button onClick={() => handleAddRow(false)}>
                    Add Empty Row
                  </Button>
                </Stack>
              </Col>
            </Row>
            {formFields.availDataArray?.[0]?.percentAmi && (
              <Row>
                <Col>
                  <Form.Text className="mt-0 pt-0">
                    *Max rent calculation based on{" "}
                    <a
                      id="income-and-rent-limits"
                      href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                      title="Income and Rent Limits (FY 2024)"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Income and Rent Limits (FY 2024)
                    </a>
                  </Form.Text>
                </Col>
              </Row>
            )}
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
