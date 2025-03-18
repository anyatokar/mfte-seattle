import BuildingDataTable from "./BuildingDataTable";
import {
  expiryBadgeEnum,
  listingStatusEnum,
  TableTypeEnum,
} from "../types/enumTypes";
import ListingActionsButtons from "./ListingActionsButtons";
import IListing from "../interfaces/IListing";
import { formatDate, timestampToDateAndTime } from "../utils/generalUtils";
import { expiringSoonDays } from "../config/config";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import IBuilding from "../interfaces/IBuilding";
import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { AddressAndPhone } from "./AddressAndPhone";
import Program from "./Program";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availDataArray"
  | "buildingName"
  | "url"
  | "listingID"
  | "expiryDate"
  | "buildingID"
  | "description"
  | "feedback"
  | "program"
>;

type ListingCardProps = {
  listing: ListingWithRequired | null;
  /** Existing, as opposed to a New listing card */

  editListingID: string;
  onEditClick: () => void;
};

const ListingCard: React.FC<ListingCardProps> = ({
  listing,

  editListingID,
  onEditClick,
}) => {
  if (listing === null) {
    listing = {
      availDataArray: [],
      url: "",
      expiryDate: "",
      listingID: "",
      buildingID: "",
      buildingName: "",
      listingStatus: undefined,
      description: "",
      feedback: "",
      program: undefined,
    };
  }

  const {
    availDataArray,
    buildingName,
    listingStatus,
    url,
    expiryDate,
    dateUpdated,
    description,
    program,
  } = listing;

  type badgeObjectType = { label: string; bg: string; text?: string };

  const statusBadgeMap: {
    [key in listingStatusEnum]: badgeObjectType;
  } = {
    [listingStatusEnum.ACTIVE]: { label: "Active", bg: "success" },
    [listingStatusEnum.IN_REVIEW]: {
      label: "In Review",
      bg: "info",
      text: "dark",
    },
    [listingStatusEnum.ARCHIVED]: { label: "Archived", bg: "secondary" },
    [listingStatusEnum.NEEDS_ATTENTION]: {
      label: "Needs Attention",
      bg: "danger",
    },
  };

  const expiryBadgeMap: {
    [key in expiryBadgeEnum]: badgeObjectType;
  } = {
    [expiryBadgeEnum.EXPIRED]: { label: "Expired", bg: "danger" },
    [expiryBadgeEnum.EXPIRING_SOON]: {
      label: "Expiring Soon",
      bg: "warning",
      text: "dark",
    },
  };

  const [statusBadge, setStatusBadge] = useState<badgeObjectType | null>(null);

  const [expiryBadge, setExpiryBadge] = useState<badgeObjectType | null>(null);

  useEffect(() => {
    function getStatusBadge() {
      if (!listing) return null;
      return listingStatus ? statusBadgeMap[listingStatus] : null;
    }

    function getExpiryBadge() {
      if (!listing) return null;
      let currentStatus = null;

      const expiryDateAsDate = new Date(expiryDate);
      const currentDate = new Date();

      if (expiryDateAsDate < currentDate) {
        currentStatus = expiryBadgeEnum.EXPIRED;
      } else if (
        expiryDateAsDate.getTime() - expiringSoonDays * 24 * 60 * 60 * 1000 <
        currentDate.getTime()
      ) {
        currentStatus = expiryBadgeEnum.EXPIRING_SOON;
      }

      return currentStatus ? expiryBadgeMap[currentStatus] : null;
    }

    setStatusBadge(getStatusBadge());
    setExpiryBadge(getExpiryBadge());
    // eslint-disable-next-line
  }, [listing]);

  const [allBuildings] = useAllBuildingsContext();

  function findSelectedBuilding(
    buildingID: string | undefined
  ): IBuilding | undefined {
    if (buildingID === undefined) {
      return undefined;
    }

    return allBuildings.find(
      (building) => buildingName === building.buildingName
    );
  }

  const building = findSelectedBuilding(listing.buildingID);

  return (
    <Card as={Container} fluid>
      <Card.Header className="px-0" data-testid="listing-card-header" as={Row}>
        <div className="d-flex align-items-center">
          <Col>
            <Card.Title className="m-0">
              {buildingName}
              {statusBadge && (
                <Badge
                  pill
                  bg={statusBadge.bg}
                  text={statusBadge.text}
                  className="ms-2"
                >
                  {statusBadge.label}
                </Badge>
              )}
            </Card.Title>
          </Col>

          <Col className="d-flex align-items-center justify-content-end">
            <ListingActionsButtons
              listing={listing}
              editListingID={editListingID}
              onEditClick={onEditClick}
            />
          </Col>
        </div>
      </Card.Header>

      <Card.Body
        className="py-2 px-0"
        data-testid="body-form-not-visible-existing-listing"
      >
        {building && (
          <>
            <Card.Text className="mb-0">
              <strong>Address and contact:</strong>
            </Card.Text>
            <AddressAndPhone
              buildingName={building.buildingName}
              address={building.address}
              contact={building.contact}
              withLinks={false}
            />

            <div className="mt-3">
              <Program selectedProgram={listing.program} />
            </div>

            <Card.Text className="mt-3 mb-0">
              <strong>All rent-reduced units in building:</strong>
            </Card.Text>
            <BuildingDataTable
              type={TableTypeEnum.amiData}
              data={building.amiData}
            />
          </>
        )}

        <Card.Text className="mt-3 mb-0">
          <strong>Available rent-reduced units:</strong>
        </Card.Text>
        <BuildingDataTable
          type={TableTypeEnum.availData}
          data={availDataArray}
          program={program}
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

        <Card.Text className="d-flex align-items-center">
          <strong className="me-1">Expires:</strong> {formatDate(expiryDate)}
          {expiryBadge && (
            <Badge
              pill
              bg={expiryBadge.bg}
              text={expiryBadge.text}
              className="ms-2"
            >
              {expiryBadge.label}
            </Badge>
          )}
        </Card.Text>
        <Card.Text className="mt-3">
          <strong>Description:</strong> {description}
        </Card.Text>
      </Card.Body>

      <Card.Footer as={Row} className="px-0">
        <Card.Text>
          Last update: {dateUpdated ? timestampToDateAndTime(dateUpdated) : ""}
        </Card.Text>
      </Card.Footer>
    </Card>
  );
};

export default ListingCard;
