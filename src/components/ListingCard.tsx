import BuildingDataTable from "./BuildingDataTable";
import { listingStatusEnum, tableType } from "../types/enumTypes";
import ListingActionsButtons from "./ListingActionButtons";
import IListing from "../interfaces/IListing";

import Badge from "react-bootstrap/esm/Badge";
import Card from "react-bootstrap/esm/Card";
import { timestampToDate, timestampToDateAndTime } from "../utils/generalUtils";
import { useState } from "react";
import EditListingForm from "./EditListingForm";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availData"
  | "buildingName"
  | "listingStatus"
  | "url"
  | "listingID"
  | "expiryDate"
  | "dateUpdated"
>;

const ListingCard: React.FC<ListingWithRequired> = ({
  availData,
  buildingName,
  listingStatus,
  url,
  listingID,
  expiryDate,
  dateUpdated,
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

  const [isEditing, setIsEditing] = useState(false);

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
            listing={{
              listingID,
              listingStatus,
              buildingName,
              url,
              availData,
            }}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </Card.Title>
      </Card.Header>
      <Card.Body>
        {!isEditing && (
          <>
            <BuildingDataTable
              type={tableType.availData}
              data={availData}
              isEditing={isEditing}
            />
            <Card.Text className="mt-3">
              <strong>URL:</strong>{" "}
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
            <Card.Text>
              {expiryDate && (
                <>
                  {" "}
                  <strong>Expires on: </strong>
                  {timestampToDate(expiryDate)}
                </>
              )}
            </Card.Text>
          </>
        )}
        {isEditing && (
          <EditListingForm
            url={url}
            availData={availData}
            expiryDate={expiryDate}
          />
        )}
        <Card.Text>
          {dateUpdated && (
            <>
              <strong>Last updated: </strong>
              {timestampToDateAndTime(dateUpdated)}
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
