import { MutableRefObject } from "react";
import { calculateDaysAgo, willShowAvailTable } from "../../utils/generalUtils";
import { useAuth } from "../../contexts/AuthContext";
import { AddressAndPhone } from "../shared/AddressAndPhone";
import BuildingCardHeader from "./BuildingCardHeader";
import BuildingCardNote from "./BuildingCardNote";
import BuildingDataTable from "../shared/BuildingDataTable";
import {
  BuildingCardEnum,
  listingStatusEnum,
  TableParentEnum,
  TableTypeEnum,
} from "../../types/enumTypes";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";

import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export interface AllBuildingCardProps {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
  parentComponent: BuildingCardEnum;
  isSelected?: boolean;
  setSelectedBuildingId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const BuildingCard: React.FC<AllBuildingCardProps> = ({
  building,
  savedHomeData,
  shouldScroll,
  isSelected,
  setSelectedBuildingId,
  parentComponent,
}) => {
  const {
    buildingID,
    buildingName,
    address,
    contact,
    amiData,
    listing,
    isEnding,
    isAgeRestricted,
  } = building;

  const { currentUser, accountType } = useAuth();

  function getSentenceItem(): JSX.Element | null {
    if (!listing || listing.listingStatus !== listingStatusEnum.ACTIVE) {
      return (
        <ListGroup.Item>
          Contact building for current availability.
        </ListGroup.Item>
      );
    } else if (listing.availDataArray.length === 0) {
      return (
        <ListGroup.Item>
          <Card.Text>No rent-reduced units available.</Card.Text>
          <i>{getDaysAgoText()}</i>
        </ListGroup.Item>
      );
    } else {
      return null;
    }
  }

  const expiresOrAgeRestricted =
    isEnding || isAgeRestricted ? (
      <>
        {isEnding && (
          <div>
            <strong>Affordability ends in 2 years or less</strong>
          </div>
        )}
        {isAgeRestricted && (
          <div>
            <strong>Age-restricted community</strong>
          </div>
        )}
      </>
    ) : null;

  function getDaysAgoText() {
    const daysAgo = calculateDaysAgo(listing.dateUpdated);

    if (daysAgo === 0) {
      return "Updated today";
    } else if (daysAgo === 1) {
      return "Updated yesterday";
    } else {
      return `Updated ${daysAgo} days ago`;
    }
  }

  function getBorder() {
    if (isSelected) {
      return "primary";
    }

    if (listing?.listingStatus === listingStatusEnum.ACTIVE) {
      return listing?.availDataArray.length > 0 ? "success" : "danger";
    }
    return "";
  }

  return (
    <Card
      border={getBorder()}
      className={`mb-3 ${parentComponent === BuildingCardEnum.BUILDING_LIST ? "card-hover-raise" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={() => setSelectedBuildingId?.(building.buildingID)}
    >
      <BuildingCardHeader
        building={building}
        savedHomeData={savedHomeData}
        shouldScroll={shouldScroll}
      />
      <ListGroup variant="flush" className="mb-2">
        {getSentenceItem()}
        <ListGroup.Item>
          <Tabs
            className="tabs"
            defaultActiveKey={
              willShowAvailTable(listing) ? "available" : "contact"
            }
          >
            {willShowAvailTable(listing) && (
              <Tab eventKey="available" title="Available" className="mt-2">
                <BuildingDataTable
                  type={TableTypeEnum.availData}
                  data={listing.availDataArray}
                  tableParent={TableParentEnum.BUILDING_CARD}
                />
                <i>{getDaysAgoText()}</i>
                {listing.description && (
                  <Card.Text className="mt-2">
                    <span style={{ fontWeight: "bold" }}>Description:</span>{" "}
                    {listing.description}
                  </Card.Text>
                )}
                {expiresOrAgeRestricted}
              </Tab>
            )}

            <Tab eventKey="contact" title="Contact">
              <div className="mt-2">
                <AddressAndPhone
                  buildingName={buildingName}
                  address={address}
                  contact={contact}
                  parentElement={TableParentEnum.BUILDING_CARD}
                />
              </div>
            </Tab>

            {amiData && (
              <Tab eventKey="details" title="Details" className="mt-2">
                <BuildingDataTable
                  type={TableTypeEnum.amiData}
                  data={amiData}
                  tableParent={TableParentEnum.BUILDING_CARD}
                />
                <div className="mt-3">{expiresOrAgeRestricted}</div>
              </Tab>
            )}
          </Tabs>
        </ListGroup.Item>
        {savedHomeData && currentUser ? (
          <ListGroup.Item>
            <BuildingCardNote
              buildingID={buildingID}
              savedHomeData={savedHomeData}
              shouldScroll={shouldScroll}
              currentUserId={currentUser.uid}
              accountType={accountType}
            />
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </Card>
  );
};

export default BuildingCard;
