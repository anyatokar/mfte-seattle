import BuildingDataTable from "./BuildingDataTable";
import {
  expiryBadgeEnum,
  listingStatusEnum,
  tableType,
} from "../types/enumTypes";
import ListingActionsButtons from "./ListingActionButtons";
import IListing from "../interfaces/IListing";
import { formatDate, timestampToDateAndTime } from "../utils/generalUtils";
import EditListingForm from "./EditListingForm";
import { expiringSoonDays } from "../config/config";

import Badge from "react-bootstrap/esm/Badge";
import Card from "react-bootstrap/esm/Card";
import { useEffect, useState } from "react";
import { useAllBuildings } from "../hooks/useAllBuildings";
import { Col, Container, Form, Row } from "react-bootstrap";
import IBuilding from "../interfaces/IBuilding";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availData"
  | "buildingName"
  | "url"
  | "listingID"
  | "expiryDate"
  | "buildingID"
>;

type ListingCardProps = {
  listing: ListingWithRequired | null;
  isFormVisible: boolean;
  toggleFormCallback: (editListingID: string, clickedSave: boolean) => void;
  /** Existing, as opposed to a New listing card */
  isExistingListing: boolean;
  editListingID: string;
  selectedBuilding?: IBuilding | null;
  setSelectedBuilding?: React.Dispatch<React.SetStateAction<IBuilding | null>>;
};

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFormVisible,
  isExistingListing,
  toggleFormCallback,
  editListingID,
  selectedBuilding,
  setSelectedBuilding,
}) => {
  if (listing === null) {
    listing = {
      availData: [],
      url: "",
      expiryDate: "",
      listingID: "",
      buildingID: "",
      buildingName: "",
      listingStatus: undefined,
    };
  }

  let [buildingsAlreadyFetched, setBuildingsAlreadyFetched] = useState(false);

  const [allBuildings, isLoadingAllBuildings] = useAllBuildings(
    isFormVisible &&
      editListingID === "" &&
      !isExistingListing &&
      !buildingsAlreadyFetched
  );

  useEffect(() => {
    if (!isLoadingAllBuildings && allBuildings.length > 0)
      setBuildingsAlreadyFetched(true);
  }, [isLoadingAllBuildings, allBuildings]);

  const {
    availData,
    buildingName,
    listingStatus,
    url,
    listingID,
    expiryDate,
    dateUpdated,
    buildingID,
  } = listing;

  type badgeObjectType = { label: string; bg: string };

  const statusBadgeMap: {
    [key in listingStatusEnum]: badgeObjectType;
  } = {
    [listingStatusEnum.ACTIVE]: { label: "Active", bg: "success" },
    [listingStatusEnum.IN_REVIEW]: { label: "In Review", bg: "info" },
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
    },
  };

  const [statusBadge, setStatusBadge] = useState<{
    label: string;
    bg: string;
  } | null>(null);
  const [expiryBadge, setExpiryBadge] = useState<{
    label: string;
    bg: string;
  } | null>(null);

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

  const onSelectBuildingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    // This assumes building names are unique.
    const selectedBuilding = allBuildings.find(
      (building) => value === building.buildingName
    );

    if (setSelectedBuilding) setSelectedBuilding(selectedBuilding || null);
  };

  return (
    <Card as={Container}>
      <Card.Header data-testid="listing-card-header" as={Row} className="p-3">
        <Col className="d-flex align-items-center p-0" xs={8} md={6}>
          <Card.Title className="mb-0 w-100">
            {isExistingListing && (
              <div className="d-flex align-items-center">
                <span>{buildingName}</span>
                {statusBadge && (
                  <Badge pill bg={statusBadge.bg} className="ms-2">
                    {statusBadge.label}
                  </Badge>
                )}
              </div>
            )}
            {!isExistingListing && isFormVisible && editListingID === "" && (
              <Form>
                <Form.Select
                  required
                  name="buildingName"
                  id="buildingName"
                  onChange={onSelectBuildingChange}
                  value={selectedBuilding?.buildingName || ""}
                >
                  <option value="">Select a building</option>
                  {allBuildings
                    .sort((a, b) =>
                      a.buildingName.localeCompare(b.buildingName)
                    )
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
          </Card.Title>
        </Col>

        <Col className="d-flex align-items-center justify-content-end p-0">
          <ListingActionsButtons
            isFormVisible={isFormVisible}
            isExistingListing={isExistingListing}
            toggleFormCallback={toggleFormCallback}
            listing={listing}
            editListingID={editListingID}
          />
        </Col>
      </Card.Header>

      {/* Form is visible, so don't show the listing data. */}
      {isFormVisible && editListingID === listingID ? (
        <Row>
          <Card.Body as={Col}>
            <EditListingForm
              listing={{ url, availData, expiryDate, listingID, buildingID }}
              selectedBuilding={selectedBuilding || null}
              isExistingListing={isExistingListing}
              toggleFormCallback={toggleFormCallback}
            />
          </Card.Body>
        </Row>
      ) : (
        isExistingListing && (
          <Row>
            <Card.Body as={Col}>
              <BuildingDataTable
                type={tableType.availData}
                data={availData}
                showListingForm={true}
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

              {isExistingListing && (
                <Card.Text className="d-flex align-items-center">
                  <strong className="me-1">Expires:</strong>
                  {formatDate(expiryDate)}
                  {expiryBadge && (
                    <Badge pill bg={expiryBadge.bg} className="ms-2">
                      {expiryBadge.label}
                    </Badge>
                  )}
                </Card.Text>
              )}
            </Card.Body>
          </Row>
        )
      )}
      {isExistingListing && (
        <Card.Footer as={Row}>
          Listing updated:{" "}
          {dateUpdated ? timestampToDateAndTime(dateUpdated) : ""}
        </Card.Footer>
      )}
    </Card>
  );
};

export default ListingCard;
