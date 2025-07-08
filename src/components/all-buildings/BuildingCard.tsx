import { useContext, MutableRefObject } from "react";
import {
  listingStatusEnum,
  TableParentEnum,
  TableTypeEnum,
} from "../../types/enumTypes";
import { deleteBuilding, saveBuilding } from "../../utils/firestoreUtils";
import { calculateDaysAgo, willShowAvailTable } from "../../utils/generalUtils";
import { useAuth } from "../../contexts/AuthContext";
import { ModalContext, ModalState } from "../../contexts/ModalContext";

import { AddressAndPhone } from "../shared/AddressAndPhone";
import BuildingCardNote from "./BuildingCardNote";
import BuildingDataTable from "../shared/BuildingDataTable";
import SaveButton from "../shared/SaveButton";
import WebsiteButton from "../shared/WebsiteButton";

import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";

import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/Stack";

export interface AllBuildingCardProps {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
}

const BuildingCard: React.FC<AllBuildingCardProps> = ({
  building,
  savedHomeData,
  shouldScroll,
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

  const { currentUser } = useAuth();

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  function handleToggleSaveBuilding() {
    if (savedHomeData) {
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      saveBuilding(currentUser?.uid, buildingID, buildingName);
    }
    shouldScroll.current = false;
  }

  function getSentenceItem(): JSX.Element | null {
    if (!listing || listing.listingStatus !== listingStatusEnum.ACTIVE) {
      return (
        <ListGroup.Item>
          Contact building for current availability.
        </ListGroup.Item>
      );
    } else if (listing.availDataArray.length === 0) {
      return <ListGroup.Item>No rent-reduced units available.</ListGroup.Item>;
    } else {
      return null;
    }
  }

  const header = (
    <Card.Header>
      <Card.Title className="mt-2">
        <div>
          {buildingName}
          {willShowAvailTable(listing) && (
            <Badge pill bg="warning" text="dark" className="units-avail-badge">
              Units available!
            </Badge>
          )}
        </div>
      </Card.Title>
      <Card.Subtitle>{address.neighborhood}</Card.Subtitle>
      <div className="mt-2">
        {currentUser ? (
          savedHomeData ? (
            <Stack direction={"horizontal"} gap={2}>
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={true}
                onClickCallback={handleToggleSaveBuilding}
              />
            </Stack>
          ) : (
            <Stack direction={"horizontal"} gap={2}>
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={false}
                onClickCallback={handleToggleSaveBuilding}
              />
            </Stack>
          )
        ) : (
          <Stack direction={"horizontal"} gap={2}>
            <WebsiteButton building={building} />
            <SaveButton isSaved={false} onClickCallback={handleShowLogin} />
          </Stack>
        )}
      </div>
    </Card.Header>
  );

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

  return (
    <Card
      border={
        listing?.listingStatus === listingStatusEnum.ACTIVE
          ? listing?.availDataArray.length > 0
            ? "success"
            : "danger"
          : ""
      }
    >
      {header}
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
                  withLinks={true}
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
            />
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </Card>
  );
};

export default BuildingCard;
