import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { listingMaxDays } from "../config/config";
import { PartialWithRequired } from "../types/partialWithRequiredType";
import { updateListingFirestore } from "../utils/firestoreUtils";

import IListing from "../interfaces/IListing";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "availData" | "url" | "expiryDate" | "listingID"
>;

const EditListingForm: React.FC<ListingWithRequired> = ({
  availData,
  url,
  expiryDate,
  listingID,
}) => {
  const originalFormFields: Partial<ListingWithRequired> = {
    availData: availData.map((availDataForUnitSize) => ({
      unitSize: availDataForUnitSize.unitSize,
      numAvail: availDataForUnitSize.numAvail,
      dateAvail: availDataForUnitSize?.dateAvail,
    })),
    url: url,
    expiryDate: expiryDate,
  };

  console.log(availData);
  const [formFields, setFormFields] = useState(originalFormFields);

  const handleInputChange = (event: any, indexInAvailData?: number) => {
    const { name, value } = event.target;

    if (name.endsWith("DateAvail") || name === "expiryDate") {
      const timestamp = value ? Timestamp.fromDate(new Date(value)) : null;
      setFormFields((prev) => ({
        ...prev,
        [name]: timestamp,
      }));
    } else if (indexInAvailData !== undefined) {
      setFormFields((prev) => {
        const newAvailData = [...(prev.availData || [])];
        newAvailData[indexInAvailData] = {
          ...newAvailData[indexInAvailData],
          [name]: value,
        };
        return { ...prev, availData: newAvailData };
      });
    } else {
      setFormFields((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    updateListingFirestore(formFields, listingID);
    console.log("Form submitted:", formFields);
  };

  const unitSizeLabels = {
    micro: "Micro/Pods",
    studio: "Studios",
    oneBed: "One Beds",
    twoBed: "Two Beds",
    threePlusBed: "Three+ Beds",
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      {/* Table */}
      <Form.Group as={Row} className="mb-3">
        <Form.Group as={Col} className="mb-3 mb-md-0">
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
                        value={
                          availDataForUnitSize.dateAvail
                            ?.toDate()
                            .toISOString()
                            .split("T")[0] || ""
                        }
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
        <Form.Group as={Col} className="mb-3 mb-md-0">
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

      {/* Expiry Date and Submit Button */}
      <Form.Group as={Row} className="mb-1">
        <Form.Group as={Col} md={6} className="mb-3 mb-md-0">
          <Form.Label>Listing Expiration Date (max 60 days)</Form.Label>
          <Form.Control
            type="date"
            name="expiryDate"
            value={
              formFields.expiryDate?.toDate().toISOString().split("T")[0] || ""
            }
            max={
              new Date(Date.now() + listingMaxDays * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            }
            onChange={handleInputChange}
          />

        </Form.Group>
        <Form.Group
          as={Col}
          className="d-flex justify-content-start justify-content-md-end align-items-end"
        >
          <Button variant="success" type="submit">
            Save Changes
          </Button>
        </Form.Group>
      </Form.Group>
    </Form>
  );
};

export default EditListingForm;
