import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  BedroomLabelEnum,
  BedroomsKeyEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";
import {
  addListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { formatCurrency, getMaxExpiryDate } from "../utils/generalUtils";
import { useAuth } from "../contexts/AuthContext";

import { p6UnitPricing } from "../config/P6-unit-pricing";
import { p345UnitPricing } from "../config/P345-unit-pricing";

import IBuilding from "../interfaces/IBuilding";
import IListing, { UnitAvailData } from "../interfaces/IListing";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import { AddressAndPhone } from "./AddressAndPhone";
import TextWithOverlay from "./TextWithOverlay";
import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
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

  console.log("isExistingListing", listing);

  const blankAvailRow: UnitAvailData = {
    unitSize: undefined,
    numAvail: "",
    dateAvailString: "",
    percentAmi: "",
    maxRent: "",
    rowIndex: 0,
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
  console.log("og form fields", originalFormFields);

  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const handleAddRow = () => {
    const newRow = {
      ...blankAvailRow,
      rowIndex: formFields.availDataArray?.length || 0,
    };

    const newAvailDataArray = [...(formFields.availDataArray || []), newRow];

    setFormFields({
      ...formFields,
      availDataArray: newAvailDataArray,
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (!formFields.availDataArray) return;

    const newAvailDataArray = formFields.availDataArray.filter(
      (row) => row.rowIndex !== rowIndex
    );

    console.log(newAvailDataArray);
    setFormFields({
      ...formFields,
      availDataArray: newAvailDataArray,
    });
  };

  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  const [allBuildings] = useAllBuildingsContext();

  const handleInputChange = (e: any, rowId?: number) => {
    const { name, value } = e.target;

    setFormFields((prev) => {
      let newAvailData = [...(prev.availDataArray || [])];

      // If updating a specific row
      if (rowId !== undefined) {
        newAvailData[rowId] = { ...newAvailData[rowId], [name]: value };

        if (name === "unitSize") {
          newAvailData[rowId] = {
            ...newAvailData[rowId],
            percentAmi: "",
          };
        }
      }
      if (name === "buildingName") {
        // This assumes building names are unique.
        const selectedBuilding = allBuildings.find(
          (building) => value === building.buildingName
        );

        console.log("value", value);

        setSelectedBuilding(selectedBuilding || null);
      }

      return {
        ...prev,
        [name]: value,
        availDataArray: newAvailData,
      };
    });
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault();

    if (!formFields) return;

    const isValid = formFields.availDataArray?.some(
      (row) => row.numAvail && row.dateAvailString && row.maxRent
    );

    if (!isValid) {
      alert("Please fill out at least one row of the availability table.");
      return;
    }

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

  const ProgramKeyEnumToLabel: Record<ProgramKeyEnum, string> = {
    [ProgramKeyEnum.P6]: "P6",
    [ProgramKeyEnum.P345]: "P3, P4, or P5",
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
      if (formFields.program === "P6") {
        return p6UnitPricing[unitSize][Number(percentAmi)];
      } else {
        return p345UnitPricing[unitSize][Number(percentAmi)];
      }
    }

    return 0;
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      {!isExistingListing && isFormVisible && listing.listingID === "" && (
        <Form>
          <Form.Select
            // TODO: Since this dropdown is not associated with the final submit button, the required is not actually enforced.
            // Listings cards need a refactor for better UI as well.
            required
            name="buildingName"
            id="buildingName"
            onChange={handleInputChange}
          >
            <option value="">Select a building*</option>
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
        </Form>
      )}

      {/* Address */}
      {/* TODO: Maybe show address for existing listing as well? */}
      {selectedBuilding && (
        <Row className="mb-3">
          <Col className="mb-md-0">
            <Form.Label>Confirm address and phone number</Form.Label>
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
              <Form.Label className="mb-0">MFTE Program*</Form.Label>

              {programOptionsArray.map((program) => (
                <Form.Check
                  key={program}
                  type="radio"
                  label={ProgramKeyEnumToLabel[program]}
                  name="program"
                  id={program}
                  value={program}
                  checked={formFields.program === program}
                  onChange={(e) => handleInputChange(e)}
                />
              ))}
              <Form.Text className="text-muted">
                Income limits:{" "}
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
        </Form.Group>
      )}

      {(isExistingListing || (selectedBuilding && formFields.program)) && (
        <Form.Group>
          {/* Table */}
          <Row className="mb-3">
            <Col className="mb-0 mb-md-0">
              <Form.Label>
                MFTE Availability* (at least one row required)
              </Form.Label>
              <Table bordered hover responsive size="sm" className="mt-0">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>% AMI</th>

                    <th>
                      <TextWithOverlay
                        text={"Quantity"}
                        overlay={"# of units of selected size and % AMI."}
                      />
                    </th>

                    <th>
                      <TextWithOverlay
                        text={"Move-in Date"}
                        overlay={
                          "If multiple units available enter the earliest date."
                        }
                      />
                    </th>
                    <th>
                      <TextWithOverlay
                        text={"  Rent"}
                        overlay={"Blanks will be set to max rent per"}
                      />
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formFields.availDataArray?.map((unitAvailData) => (
                    <tr key={unitAvailData.rowIndex}>
                      <td>
                        <Form.Select
                          required
                          name="unitSize"
                          id="unitSize"
                          onChange={(e) =>
                            handleInputChange(e, unitAvailData.rowIndex)
                          }
                          value={unitAvailData.unitSize}
                        >
                          <option value=""></option>
                          {availSizes.map((unitSize) => (
                            <option key={unitSize} value={unitSize}>
                              {BedroomLabelEnum[unitSize]}
                            </option>
                          ))}
                        </Form.Select>
                      </td>

                      <td>
                        <Form.Select
                          required
                          name="percentAmi"
                          id="percentAmi"
                          onChange={(e) =>
                            handleInputChange(e, unitAvailData.rowIndex)
                          }
                          value={unitAvailData.percentAmi}
                          disabled={!unitAvailData.unitSize}
                        >
                          <option value=""></option>
                          {selectedBuilding?.amiData[
                            unitAvailData.unitSize as BedroomsKeyEnum
                          ]?.map((percent) => (
                            <option key={percent} value={percent}>
                              {percent}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min="0"
                          name="numAvail"
                          value={unitAvailData.numAvail}
                          onChange={(e) =>
                            handleInputChange(e, unitAvailData.rowIndex)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="date"
                          name="dateAvailString"
                          value={unitAvailData.dateAvailString || ""}
                          onChange={(e) =>
                            handleInputChange(e, unitAvailData.rowIndex)
                          }
                        />
                      </td>

                      <td>
                        <InputGroup>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type="number"
                            min="0"
                            name="maxRent"
                            value={unitAvailData.maxRent}
                            onChange={(event) =>
                              handleInputChange(event, unitAvailData.rowIndex)
                            }
                          />
                        </InputGroup>
                        <div className="text-end">
                          <Form.Text>
                            {!!getMaxRent(unitAvailData) &&
                              formFields.program &&
                              `${ProgramKeyEnumToLabel[formFields.program]} & ${BedroomLabelEnum[unitAvailData.unitSize as BedroomsKeyEnum]} & ${unitAvailData.percentAmi}% AMI ⟶ ${formatCurrency(getMaxRent(unitAvailData))}`}
                          </Form.Text>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() =>
                            handleDeleteRow(unitAvailData.rowIndex)
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
            <Row>
              <Col>
                <Button onClick={handleAddRow}>Add Row</Button>
              </Col>
            </Row>
          </Row>

          {/* URL */}
          <Row className="mb-3">
            <Col className="mb-0 mb-md-0">
              <Form.Label>Listings URL* (include http://)</Form.Label>
              <Form.Control
                required
                type="url"
                name="url"
                onChange={handleInputChange}
                value={formFields.url}
              />
              <Form.Text className="text-muted">
                Url you'd share with a prospective renter to view available MFTE
                units. Often ends with /floorplans
              </Form.Text>
            </Col>
          </Row>

          {/* Expiry Date */}
          <Row className="mb-3">
            <Form.Label>Listing Expiration Date (up to 60 days)</Form.Label>
            <Col md={6} className="mb-0 mb-md-0">
              <Form.Control
                type="date"
                name="expiryDate"
                value={formFields.expiryDate || ""}
                max={getMaxExpiryDate()}
                onChange={handleInputChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Form.Group className="mb-0 mb-md-0">
              <Form.Label>Description (max 200 characters)</Form.Label>

              <Form.Control
                as="textarea"
                name="description"
                id="description"
                rows={3}
                onChange={handleInputChange}
                value={formFields.description}
                maxLength={200}
              />
              <Form.Text className="text-muted">
                Will be shared as part of the listing.
              </Form.Text>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Col className="mb-0 mb-md-0">
              <Form.Label>Additional comments</Form.Label>

              <Form.Control
                as="textarea"
                name="feedback"
                id="feedback"
                rows={3}
                onChange={handleInputChange}
                value={formFields.feedback}
              />
              <Form.Text className="text-muted">
                Won't be shared publicly. Suggestions on how to improve this
                form are welcome.
              </Form.Text>
            </Col>
          </Row>

          <Form.Group className="text-end">
            <Button variant="success" type="submit" size="lg">
              Save
            </Button>
          </Form.Group>
        </Form.Group>
      )}
    </Form>
  );
};

export default EditListingForm;
