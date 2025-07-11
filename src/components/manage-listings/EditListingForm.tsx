import { useState } from "react";
import { getMaxExpiryDate } from "../../utils/generalUtils";
import { useAuth } from "../../contexts/AuthContext";
import AvailUnitsTable from "../shared/AvailUnitsTable";
import ListingCardBuildingData from "./ListingCardBuildingData";
import NotListedForm from "./NotListedForm";

import { BedroomsKeyEnum } from "../../types/enumTypes";
import { EditListingFormFields } from "../../types/editListingFormFieldsType";
import { PercentAmi } from "../../interfaces/IBuilding";
import { AvailDataArray } from "../../interfaces/IListing";
import { CurrentBuildingData } from "../../interfaces/ITempBuilding";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

type EditListingFormProps = {
  currentBuildingData: CurrentBuildingData | null;
  alert: string;
  formFields: EditListingFormFields;
  setFormFields: React.Dispatch<React.SetStateAction<EditListingFormFields>>;
  setCurrentBuildingData: React.Dispatch<
    React.SetStateAction<CurrentBuildingData | null>
  >;
  onInputChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    rowId?: string,
    buildingID?: string
  ) => void;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  currentBuildingData,
  alert,
  formFields,
  setFormFields,
  onInputChange,
  setCurrentBuildingData,
}) => {
  if (!currentBuildingData) return null;

  const { currentUser } = useAuth();
  if (!currentUser) return null;

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
    <>
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
              {/* This isn't clear, there's, null, "", or the ID. Maybe just add names to these. */}
              {currentBuildingData.buildingID !== "" && (
                <Row>
                  <Col className="mb-md-0">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowEditBuildingData((prev) => !prev)}
                      disabled={showEditBuildingData}
                    >
                      Edit
                    </Button>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Available Units */}
      <Row className="mb-3">
        <Col className="mb-0">
          <Form.Label className="mb-0 fw-bold">Available units:</Form.Label>

          {/* No Units Available */}
          <Form.Check
            type="switch"
            id="noneAvailableSwitch"
            name="noneAvailable"
            label="No units available"
            checked={formFields.noneAvailable}
            onChange={onInputChange}
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
                  onChange={onInputChange}
                  value={formFields.url}
                />
                <Form.Text>
                  Link that comes as close as possible to showing all available
                  rent-reduced units in this building. Include http://
                </Form.Text>
              </Col>
            </Row>
          )}

          {!formFields.noneAvailable && (
            <AvailUnitsTable
              currentBuildingData={currentBuildingData}
              formFields={formFields}
              setFormFields={setFormFields}
              handleInputChange={onInputChange}
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
            onChange={onInputChange}
          />
        </Col>
        <Form.Text>
          Optional. Up to 60 days. If left blank will be set to the max of 60
          days.
        </Form.Text>
      </Row>

      {/* Description */}
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
            onChange={onInputChange}
            value={formFields.description}
            maxLength={200}
          />
          <Form.Text>
            Optional. Will be shared as part of the listing. Max 200 characters.
          </Form.Text>
        </Col>
      </Row>

      {/* Feedback */}
      <Row className="mb-3">
        <Col className="mb-0">
          <Form.Label className="mb-0 fw-bold">Form feedback:</Form.Label>
          <Form.Control
            as="textarea"
            name="feedback"
            id="feedback"
            rows={3}
            onChange={onInputChange}
            value={formFields.feedback}
          />
          <Form.Text>
            Optional. Will not be shared publicly. Feedback can include data
            corrections, suggestions for form improvement, user experience, etc.
            Thank you!
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
  );
};

export default EditListingForm;
