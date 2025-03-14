import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  ProgramKeyEnum,
  ProgramLabelEnum,
} from "../types/enumTypes";
import {
  addListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { formatCurrency, getMaxExpiryDate } from "../utils/generalUtils";
import { useAuth } from "../contexts/AuthContext";
import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { colWidths } from "../config/config";

import { p6UnitPricing } from "../config/P6-unit-pricing";
import { p345UnitPricing } from "../config/P345-unit-pricing";

import { AddressAndPhone } from "./AddressAndPhone";

import IBuilding from "../interfaces/IBuilding";
import IListing, { UnitAvailData } from "../interfaces/IListing";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "listingID"
  | "buildingID"
  | "description"
  | "feedback"
  | "program"
>;
type EditListingFormProps = {
  listing: ListingWithRequired;
  isExistingListing: boolean;
  toggleFormCallback: (editListingID: string, isSaved: boolean) => void;
  isFormVisible: boolean;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  listing,
  isExistingListing,
  toggleFormCallback,
  isFormVisible,
}) => {
  const {
    availDataArray,
    url,
    expiryDate,
    listingID,
    description,
    feedback,
    program,
  } = listing;

  const blankAvailRow: UnitAvailData = {
    unitSize: undefined,
    dateAvailString: "",
    percentAmi: undefined,
    maxRent: "",
    rowId: `${Date.now()}`,
    aptNum: "",
  };

  const originalFormFields: Partial<IListing> = {
    buildingName: listing.buildingName,
    availDataArray:
      availDataArray.length > 0 ? availDataArray : [blankAvailRow],
    url: url,
    expiryDate: expiryDate,
    description: description,
    feedback: feedback,
    program: program,
  };

  const [formFields, setFormFields] = useState(originalFormFields);

  const { currentUser } = useAuth();

  const [allBuildings] = useAllBuildingsContext();

  const [isNotListed, setIsNotListed] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState<
    IBuilding | undefined
  >(findSelectedBuilding(listing.buildingName || ""));

  if (!currentUser) return null;

  const handleAddRow = () => {
    const newRow = {
      ...blankAvailRow,
      rowId: `${Date.now()}`,
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

  function findSelectedBuilding(buildingName: string): IBuilding | undefined {
    return allBuildings.find(
      (building) => buildingName === building.buildingName
    );
  }

  const handleInputChange = (e: any, rowId?: string) => {
    const { name, value } = e.target;

    setFormFields((prev) => {
      const newAvailData = [...(prev.availDataArray || [])];

      // If updating a specific row

      // Find the index of the row with the specific rowId
      const rowIndex = newAvailData.findIndex((row) => row.rowId === rowId);

      if (rowId !== undefined) {
        newAvailData[rowIndex] = { ...newAvailData[rowIndex], [name]: value };

        if (name === "unitSize") {
          newAvailData[rowIndex] = {
            ...newAvailData[rowIndex],
            // TODO: Is this percentAmi needed?
            percentAmi: undefined,
          };
        }
      }
      if (name === "buildingName") {
        // This assumes building names are unique.
        setSelectedBuilding(findSelectedBuilding(value) || undefined);
      }

      const update = rowId
        ? { availDataArray: newAvailData }
        : { [name]: value };

      return {
        ...prev,
        ...update,
      };
    });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!formFields) return;

    if (!isExistingListing) {
      const listingID = await addListingFirestore(
        formFields,
        selectedBuilding?.buildingID || "",
        currentUser.uid
      );
      if (listingID) {
        console.log(
          `Successfully added listing for ${selectedBuilding?.buildingName}. ListingID: ${listingID}`
        );
        toggleFormCallback("", true);
      }
    } else {
      const isSuccessful = await updateListingFirestore(formFields, listingID);
      if (isSuccessful) {
        console.log(
          `Successfully updated listing for ${selectedBuilding?.buildingName}, listingID: ${listingID}`
        );
        toggleFormCallback(listingID, true);
      }
    }
  };

  const programOptionsArray: ProgramKeyEnum[] = [
    ProgramKeyEnum.P6,
    ProgramKeyEnum.P345,
  ];

  const availSizes: BedroomsKeyEnum[] = selectedBuilding
    ? (Object.keys(selectedBuilding.amiData) as BedroomsKeyEnum[])
    : [];

  function getMaxRent(unitAvailData: UnitAvailData): number {
    const { unitSize, percentAmi } = unitAvailData;

    if (!unitSize || !percentAmi || !formFields.program) return 0;

    if (unitAvailData.unitSize && unitAvailData.percentAmi) {
      if (formFields.program === ProgramKeyEnum.P6) {
        return p6UnitPricing[unitSize][percentAmi];
      } else {
        return p345UnitPricing[unitSize][percentAmi];
      }
    }

    return 0;
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      {!isExistingListing && isFormVisible && listing.listingID === "" && (
        <Row className="mb-3">
          <Col md={6} className="mb-md-0">
            <Form.Select
              //TODO: Listings cards need a refactor for better UI.
              required
              name="buildingName"
              id="buildingName"
              onChange={handleInputChange}
            >
              <option value="">Select a building</option>
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
      {/* TODO: Maybe show address for existing listing? */}
      {selectedBuilding && (
        <Row className="mb-3">
          <Col className="mb-md-0">
            <Form.Label className="mb-0 fw-bold">
              Confirm location and contact info:
            </Form.Label>

            <AddressAndPhone
              buildingName={selectedBuilding.buildingName}
              address={selectedBuilding.address}
              contact={selectedBuilding.contact}
              withLinks={false}
            />
          </Col>
        </Row>
      )}

      {(selectedBuilding || isExistingListing) && (
        <Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Label className="mb-0 fw-bold">Program:</Form.Label>

              {programOptionsArray.map((program) => (
                <Form.Check
                  required
                  key={program}
                  type="radio"
                  label={ProgramLabelEnum[program]}
                  name="program"
                  id={program}
                  value={program}
                  checked={formFields.program === program}
                  onChange={(e) => handleInputChange(e)}
                />
              ))}
            </Col>
          </Row>
        </Form.Group>
      )}

      {(isExistingListing || (selectedBuilding && formFields.program)) && (
        <Form.Group>
          {/* URL */}
          <Row className="mb-3">
            <Col className="mb-0 mb-md-0">
              <Form.Label className="mb-0 fw-bold">Listings URL:</Form.Label>
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
                <Form.Label className="fw-bold mb-0">
                  Available units:
                </Form.Label>
                <div>
                  <Form.Text>List all available rent-reduced units.</Form.Text>
                </div>
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th style={{ minWidth: colWidths.unitSize }}>Size</th>
                      <th style={{ minWidth: colWidths.percentAmi }}>% AMI</th>
                      <th style={{ minWidth: colWidths.rent }}>Rent</th>
                      <th style={{ minWidth: colWidths.aptNum }}>Apt #</th>
                      <th style={{ minWidth: colWidths.dateAvail }}>
                        Move-in Date
                      </th>
                      <th>Delete Row</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formFields.availDataArray?.map((unitAvailData) => (
                      <tr key={unitAvailData.rowId}>
                        <td>
                          <Form.Select
                            required
                            name="unitSize"
                            id="unitSize"
                            onChange={(e) =>
                              handleInputChange(e, unitAvailData.rowId)
                            }
                            value={unitAvailData.unitSize}
                          >
                            <option value={unitAvailData.unitSize}>
                              {unitAvailData.unitSize
                                ? unitSizeLabelEnum[unitAvailData.unitSize]
                                : ""}
                            </option>
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
                            value={unitAvailData.percentAmi || ""}
                            disabled={!unitAvailData.unitSize}
                          >
                            <option value={unitAvailData.percentAmi}>
                              {unitAvailData.percentAmi}
                            </option>
                            {selectedBuilding?.amiData[
                              unitAvailData.unitSize as BedroomsKeyEnum
                            ]?.map((percent) => (
                              <option key={percent} value={percent}>
                                {percent}
                              </option>
                            ))}
                          </Form.Select>
                        </td>
                        <td style={{ maxWidth: colWidths.rent }}>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              required
                              type="number"
                              min="0"
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
                                formFields.program &&
                                `${ProgramLabelEnum[formFields.program]}, 
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
                        <td className="text-center">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteRow(unitAvailData.rowId)}
                            disabled={
                              formFields.availDataArray
                                ? formFields.availDataArray.length <= 1
                                : true
                            }
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Row>
              <Col className="text-end">
                <Button onClick={handleAddRow} size="sm">
                  Add Row
                </Button>
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
            <Col md={6} className="mb-0 mb-md-0">
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
            <Col className="mb-0 mb-md-0">
              <Form.Label className="mb-0 fw-bold">
                Featured description:{" "}
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
            <Col className="mb-0 mb-md-0">
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
        </Form.Group>
      )}
    </Form>
  );
};

export default EditListingForm;
