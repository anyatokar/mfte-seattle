import BuildingDataTable from "./BuildingDataTable";
import { listingStatusEnum, tableType } from "../types/enumTypes";
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
    if (allBuildings.length > 0) setBuildingsAlreadyFetched(true);
  }, [allBuildings]);

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

  const statusBadgeMap: {
    [key in listingStatusEnum]: { label: string; bg: string };
  } = {
    [listingStatusEnum.ACTIVE]: { label: "Active", bg: "success" },
    [listingStatusEnum.IN_REVIEW]: { label: "In Review", bg: "info" },
    [listingStatusEnum.ARCHIVED]: { label: "Archived", bg: "secondary" },
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

  const [badge, setBadge] = useState<{ label: string; bg: string } | null>(
    null
  );

  useEffect(() => {
    function getBadge() {
      if (!listing) return null;
      let currentStatus = listingStatus;

      const expiryDateAsDate = new Date(expiryDate);
      const currentDate = new Date();

      if (currentStatus !== listingStatusEnum.ARCHIVED) {
        if (expiryDateAsDate < currentDate) {
          currentStatus = listingStatusEnum.EXPIRED;
        } else if (
          expiryDateAsDate.getTime() - expiringSoonDays * 24 * 60 * 60 * 1000 <
          currentDate.getTime()
        ) {
          currentStatus = listingStatusEnum.EXPIRING_SOON;
        }
      }

      return currentStatus ? statusBadgeMap[currentStatus] : null;
    }

    setBadge(getBadge());
  }, [expiryDate]);

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
                {badge && (
                  <Badge pill bg={badge.bg} className="ms-2">
                    {badge.label}
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
              // allBuildings={allBuildings}
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

              <Card.Text>
                <strong>Expires:</strong> {formatDate(expiryDate)}
              </Card.Text>
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
