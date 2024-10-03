import Card from "react-bootstrap/esm/Card";
import IListing from "../interfaces/IListing";
import Badge from "react-bootstrap/esm/Badge";
import BuildingDataTable from "./BuildingDataTable";
import { listingStatusEnum, tableType } from "../types/enumTypes";
import { deleteListing, updateListing } from "../utils/firestoreUtils";

import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";
import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ListingActionsButtons from "./ListingActionButtons";
import { Fragment } from "react";

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
  const statusBadgeMap: {
    [key in listingStatusEnum]: { label: string; bg: string };
  } = {
    [listingStatusEnum.ACTIVE]: { label: "Active", bg: "success" },
    [listingStatusEnum.IN_REVIEW]: { label: "In Review", bg: "info" },
    [listingStatusEnum.ARCHIVED]: {
      label: "Archived",
      bg: "secondary",
    },
    [listingStatusEnum.EXPIRED]: { label: "Expired", bg: "danger" },
    [listingStatusEnum.EXPIRING_SOON]: {
      label: "Expiring Soon",
      bg: "warning",
    },
    [listingStatusEnum.NEEDS_ATTENTION]: {
      label: "Needs Attention",
      bg: "danger",
    },
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex align-items-center">
            <span>{buildingName}</span>
            {statusBadgeMap[listingStatus] && (
              <Badge
                pill
                bg={statusBadgeMap[listingStatus].bg}
                className="ms-2"
              >
                {statusBadgeMap[listingStatus].label}
              </Badge>
            )}
          </div>
          <ListingActionsButtons
            listingID={listingID}
            listingStatus={listingStatus}
            buildingName={buildingName}
            url={url}
            availData={availData}
          />
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <BuildingDataTable type={tableType.availData} data={availData} />
        <Card.Text className="mt-3">
          <strong>Listing URL:</strong>{" "}
          <a
            id="addressLink"
            href={url}
            target="_blank"
            rel="noreferrer"
            className="address-phone-link"
          >
            {url}
          </a>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
