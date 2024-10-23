import { useState } from "react";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import {
  addListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

import IBuilding from "../interfaces/IBuilding";
import IListing from "../interfaces/IListing";

import { useAuth } from "../contexts/AuthContext";
import { getMaxExpiryDate } from "../utils/generalUtils";

type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availData"
  | "url"
  | "expiryDate"
  | "listingID"
  | "buildingID"
  | "description"
>;

type EditListingFormProps = {
  listing: ListingWithRequired;
  selectedBuilding: IBuilding | null;
  isExistingListing: boolean;
  toggleFormCallback: (editListingID: string, isSaved: boolean) => void;
};

const EditListingForm: React.FC<EditListingFormProps> = ({
  listing,
  isExistingListing,
  toggleFormCallback,
  selectedBuilding,
}) => {
  const { availData, url, expiryDate, listingID, description } = listing;

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

  const originalFormFields: Partial<ListingWithRequired> = {
    availData:
      availData.length > 0
        ? availData.map((availDataForUnitSize) => ({
            unitSize: availDataForUnitSize.unitSize,
            numAvail: availDataForUnitSize.numAvail,
            dateAvail: availDataForUnitSize.dateAvail || "",
            maxRent: availDataForUnitSize.maxRent || 0,
          }))
        : unitSizeFields.map((unitSize) => ({
            unitSize: unitSize,
            numAvail: 0,
            dateAvail: "",
            maxRent: 0,
          })),
    url: url,
    expiryDate: expiryDate,
    description: description,
  };

  const [formFields, setFormFields] = useState(originalFormFields);

  const { currentUser } = useAuth();

  if (!currentUser) return null;

  // If this is a new listing, creates blanks for availData
  if (availData.length === 0) {
    for (let unitSize of unitSizeFields) {
      const blankRow = {
        unitSize: unitSize,
        numAvail: 0,
        dateAvail: "",
        maxRent: 0,
      };
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

    if (!formFields) return;

    const isValid = formFields.availData?.some(
      (row) => row.numAvail > 0 && row.dateAvail
    );

    if (!isValid) {
      alert(
        "Please add at least one quantity and date to the availability table"
      );
      return;
    }

    if (!isExistingListing) {
      const listingID = await addListingFirestore(
        selectedBuilding?.buildingName || "",
        formFields,

        selectedBuilding?.buildingID || "",
        currentUser.uid
      );
      if (listingID) {
        console.log(
          `Successfully added listing for ${selectedBuilding?.buildingName}, with listingID: ${listingID}`
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

  return (
    <Form onSubmit={handleFormSubmit}>
      {!isExistingListing && (
        <>
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
          <Form.Label>Availability* (at least one row required)</Form.Label>
          <Table bordered hover responsive size="sm" className="mt-0">
            <thead>
              <tr>
                <th>Unit Type</th>
                <th>Number of Units Available</th>
                <th>Earliest Available Date</th>
                <th>Max Rent</th>
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
                    <td>
                      <InputGroup>
                        <InputGroup.Text>$</InputGroup.Text>
                        <Form.Control
                          type="number"
                          min="0"
                          name="maxRent"
                          value={availDataForUnitSize.maxRent || ""}
                          onChange={(event) =>
                            handleInputChange(event, indexInAvailData)
                          }
                        />
                      </InputGroup>
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
        <Form.Label>Listing Expiration Date (up to 60 days)</Form.Label>
        <Form.Group as={Col} md={6} className="mb-0 mb-md-0">
          <Form.Control
            type="date"
            name="expiryDate"
            value={formFields.expiryDate || ""}
            max={getMaxExpiryDate()}
            onChange={handleInputChange}
          />
        </Form.Group>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Group as={Col} className="mb-0 mb-md-0">
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
        </Form.Group>
      </Form.Group>

      <Form.Group as={Col} className="text-end">
        <Button variant="success" type="submit" size="lg">
          Save
        </Button>
      </Form.Group>
    </Form>
  );
};

export default EditListingForm;
