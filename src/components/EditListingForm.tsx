import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  addListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";

import IListing from "../interfaces/IListing";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import IBuilding from "../interfaces/IBuilding";

import { useAuth } from "../contexts/AuthContext";
import { getMaxExpiryDate } from "../utils/generalUtils";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "availData" | "url" | "expiryDate" | "listingID" | "buildingID"
>;

type EditListingFormProps = {
  listing: ListingWithRequired;
  setEditingListingID: React.Dispatch<React.SetStateAction<string | null>>;
  allBuildings?: IBuilding[];
  setWasNewListingSubmitted?: React.Dispatch<React.SetStateAction<boolean>>;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  listing,
  allBuildings = [],
  setEditingListingID,
  setWasNewListingSubmitted,
}) => {
  const { availData, url, expiryDate, listingID, buildingID } = listing;

  const isNewListing = !listingID;

  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>();

  const originalFormFields: Partial<ListingWithRequired> = {
    availData: availData.map((availDataForUnitSize) => ({
      unitSize: availDataForUnitSize.unitSize,
      numAvail: availDataForUnitSize.numAvail,
      dateAvail: availDataForUnitSize?.dateAvail,
    })),
    url: url,
    expiryDate: expiryDate,
  };

  const [formFields, setFormFields] = useState(originalFormFields);

  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const onSelectBuildingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    // This assumes building names are unique.
    const selectedBuilding = allBuildings.find(
      (building) => value === building.buildingName
    );

    setSelectedBuilding(selectedBuilding || null);
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const unitSizeLabels = {
    micro: "Micro/Pods",
    studio: "Studios",
    oneBed: "One Beds",
    twoBed: "Two Beds",
    threePlusBed: "Three+ Beds",
  };

  const unitSizeFields: Array<keyof typeof unitSizeLabels> = [
    "micro",
    "studio",
    "oneBed",
    "twoBed",
    "threePlusBed",
  ];

  // If this is a new listing, creates blanks for availData
  if (availData.length === 0) {
    for (let unitSize of unitSizeFields) {
      const blankRow = { unitSize: unitSize, numAvail: 0, dateAvail: "" };
      availData.push(blankRow);
    }
  }

  const handleInputChange = (event: any, indexInAvailData?: number) => {
    const { name, value } = event.target;

    // updating the availData object
    if (indexInAvailData !== undefined) {
      setFormFields((prev) => {
        const newAvailData = [...(prev.availData || [])];
        newAvailData[indexInAvailData] = {
          ...newAvailData[indexInAvailData],
          [name]: value,
        };
        return { ...prev, availData: newAvailData };
      });
    } else {
      // updating the rest, expiryDate, URL, etc.
      setFormFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();

    if (isNewListing) {
      await addListingFirestore(formFields, buildingID, currentUser.uid);
    } else {
      await updateListingFirestore(formFields, listingID);
    }

    setEditingListingID(null);
    // Only passed for new listing form.
    if (setWasNewListingSubmitted) setWasNewListingSubmitted(true);
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {isNewListing && (
        <>
          <Form.Group as={Row} className={selectedBuilding ? "mb-2" : "mb-3"}>
            <Form.Group as={Col} md={6} className="mb-0 mb-md-0">
              <Form.Label>Building Name*</Form.Label>
              <Form.Select
                required
                name="buildingName"
                id="buildingName"
                onChange={onSelectBuildingChange}
                value={formFields.buildingName}
              >
                <option value="">Select a building</option>
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
            </Form.Group>
          </Form.Group>

          {/* Address */}
          {selectedBuilding && (
            <Form.Group as={Row} className="mb-0">
              <Form.Group as={Col} className="mb-md-0">
                <p>
                  {selectedBuilding.streetNum} {selectedBuilding.street}
                  <br />
                  {selectedBuilding.city}, {selectedBuilding.state}{" "}
                  {selectedBuilding.zip}
                  {selectedBuilding.phone ? <br /> : null}
                  {selectedBuilding.phone}
                  {selectedBuilding.phone2 ? <br /> : null}
                  {selectedBuilding.phone2}
                </p>
              </Form.Group>
            </Form.Group>
          )}
        </>
      )}

      {/* Table */}
      <Form.Group as={Row} className="mb-3">
        <Form.Group as={Col} className="mb-0 mb-md-0">
          <Table bordered hover responsive size="sm" className="mt-0">
            <thead>
              <tr>
                <th>Unit Type</th>
                <th>Number of Units Available</th>
                <th>Earliest Available Date</th>
              </tr>
            </thead>
            <tbody>
              {formFields.availData?.map(
                (availDataForUnitSize, indexInAvailData) => (
                  <tr key={availDataForUnitSize.unitSize}>
                    <td>{unitSizeLabels[availDataForUnitSize.unitSize]}</td>
                    <td>
                      <Form.Control
                        type="number"
                        min="0"
                        name="numAvail"
                        value={availDataForUnitSize.numAvail}
                        onChange={(event) =>
                          handleInputChange(event, indexInAvailData)
                        }
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="date"
                        name="dateAvail"
                        value={availDataForUnitSize.dateAvail || ""}
                        onChange={(event) =>
                          handleInputChange(event, indexInAvailData)
                        }
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Form.Group>
      </Form.Group>

      {/* URL */}
      <Form.Group as={Row} className="mb-3">
        <Form.Group as={Col} className="mb-0 mb-md-0">
          <Form.Label>Listing URL* (include http://)</Form.Label>
          <Form.Control
            required
            type="url"
            name="url"
            onChange={handleInputChange}
            value={formFields.url}
          />
        </Form.Group>
      </Form.Group>

      {/* Expiry Date */}
      <Form.Group as={Row} className="mb-3">
        <Form.Group as={Col} md={6} className="mb-0 mb-md-0">
          <Form.Label>Listing Expiration Date (max 60 days)</Form.Label>
          <Form.Control
            type="date"
            name="expiryDate"
            value={formFields.expiryDate || ""}
            max={getMaxExpiryDate()}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form.Group>

      {/* Message (only for new listing) */}
      {!listingID && (
        <Form.Group as={Row} className="mb-3">
          <Form.Group as={Col} className="mb-0 mb-md-0">
            <Form.Label>
              Any additional notes (questions and feedback welcome)
            </Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              id="message"
              rows={5}
              onChange={handleInputChange}
              value={formFields.message}
            />
          </Form.Group>
        </Form.Group>
      )}

      <Form.Group
        as={Col}
        className="d-flex justify-content-start justify-content-md-end align-items-end"
      >
        <Button variant="success" type="submit">
          Save Changes
        </Button>
      </Form.Group>
    </Form>
  );
};

export default EditListingForm;
