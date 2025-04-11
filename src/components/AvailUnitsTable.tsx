import { formatCurrency } from "../utils/generalUtils";
import { useAuth } from "../contexts/AuthContext";
import { colWidths, optionalUrlsArray } from "../config/constants";
import { p6UnitPricing } from "../config/P6-unit-pricing";
import { p345UnitPricing } from "../config/P345-unit-pricing";
import { createBlankAvailRow } from "./EditListingForm";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  unitSizeLabelEnum,
  BedroomsKeyEnum,
  ProgramKeyEnum,
  ProgramLabelEnum,
} from "../types/enumTypes";
import IListing, {
  UnitAvailData,
} from "../interfaces/IListing";
import { CurrentBuildingData } from "../interfaces/ITempBuilding";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Table from "react-bootstrap/Table";
import { Trash } from "react-bootstrap-icons";

export type EditListingFormFields = PartialWithRequired<
  IListing,
  | "buildingName"
  | "buildingID"
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "description"
  | "feedback"
>;

type EditListingFormProps = {
  currentBuildingData: CurrentBuildingData;
  formFields: EditListingFormFields;
  setFormFields: React.Dispatch<React.SetStateAction<EditListingFormFields>>;
  handleInputChange: (e: any, rowId?: string, buildingID?: string) => void;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  currentBuildingData,
  formFields,
  setFormFields,
  handleInputChange,
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const handleAddRow = (isDuplicate: boolean) => {
    const newRow = isDuplicate
      ? {
          ...formFields.availDataArray[formFields.availDataArray.length - 1],
          rowId: `${Date.now()}`,
        }
      : {
          ...createBlankAvailRow(),
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

  const availSizes: BedroomsKeyEnum[] = currentBuildingData?.amiData
    ? (Object.keys(currentBuildingData.amiData) as BedroomsKeyEnum[]).filter(
        (key) => {
          return currentBuildingData.amiData[key].length > 0;
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

  const programOptionsArray: ProgramKeyEnum[] = [
    ProgramKeyEnum.P6,
    ProgramKeyEnum.P345,
    ProgramKeyEnum.other,
  ];

  return (
    currentBuildingData && (
      <div className="mb-3">
        <Row>
          <Col className="mb-0">
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
                        title="Delete row"
                      >
                        <Trash size={20} aria-label="Delete row" />
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
                          currentBuildingData &&
                          Object.values(currentBuildingData.amiData).flat()
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
                        {currentBuildingData.amiData?.[
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
                              autoFocus
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
              <Button
                onClick={() => handleAddRow(true)}
                title="Duplicate last row"
              >
                Duplicate Row
              </Button>
              <Button onClick={() => handleAddRow(false)} title="Add empty row">
                Add Row
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
      </div>
    )
  );
};

export default EditListingForm;
