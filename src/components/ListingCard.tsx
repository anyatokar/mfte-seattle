import Card from "react-bootstrap/esm/Card";
import IListing from "../interfaces/IListing";
import Badge from "react-bootstrap/esm/Badge";
import BuildingDataTable from "./BuildingDataTable";
import { listingStatusEnum, tableType } from "../types/enumTypes";
import { deleteListing, updateListing } from "../utils/firestoreUtils";

import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

type ListingWithRequired = PartialWithRequired<
  IListing,
  "availData" | "buildingName" | "listingStatus" | "url" | "listingID"
>;

const ListingCard: React.FC<ListingWithRequired> = ({
  availData,
  buildingName,
  listingStatus,
  url,
  listingID,
}) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="mt-2">
          {buildingName}{" "}
          {listingStatus === listingStatusEnum.ACTIVE ? (
            <Badge pill bg="success">
              Active
            </Badge>
          ) : (
            <Badge pill bg="secondary">
              Pending Review
            </Badge>
          )}
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Text>url: {url}</Card.Text>
        <BuildingDataTable type={tableType.availData} data={availData} />
        <Row>
          <Col>
            <Button
              className="center"
              size="sm"
              title={`Edit listing for ${buildingName}`}
              type="button"
              value="Edit"
              // onClick={() => {
              //   updateListing(listingID, buildingName, fieldsToUpdate);
              // }}
            >
              Update
            </Button>
          </Col>
          <Col>
            <Button
              className="center"
              size="sm"
              variant="outline-warning"
              title={`Archive listing for ${buildingName}`}
              type="button"
              value="Archive"
              onClick={() => {
                updateListing(listingID, buildingName, {
                  listingStatus: listingStatusEnum.ARCHIVED,
                });
              }}
            >
              Archive
            </Button>
          </Col>
          <Col>
            <Button
              className="center"
              size="sm"
              variant="outline-danger"
              title={`Delete listing for ${buildingName}`}
              type="button"
              value="Delete"
              onClick={() => {
                deleteListing(listingID, buildingName);
              }}
            >
              Delete
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
