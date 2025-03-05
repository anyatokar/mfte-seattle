import { useContext, MutableRefObject } from "react";
import { listingStatusEnum, tableType } from "../types/enumTypes";
import { deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import { AddressAndPhone } from "./AddressAndPhone";
import BuildingCardNote from "./BuildingCardNote";
import BuildingDataTable from "./BuildingDataTable";
import ListingButton from "./ListingButton";
import SaveButton from "./SaveButton";
import WebsiteButton from "./WebsiteButton";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";

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
  const { buildingID, buildingName, address, contact, amiData, listing } =
    building;

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

  return (
    <Card
      border={
        listing?.listingStatus === listingStatusEnum.ACTIVE ? "success" : ""
      }
    >
      <Card.Header>
        <Card.Title className="mt-2">
          <div>
            {buildingName}
            {listing?.listingStatus === listingStatusEnum.ACTIVE && (
              <Badge
                pill
                bg="warning"
                text="dark"
                className="units-avail-badge"
              >
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
                {" "}
                <ListingButton listing={listing} isMarker={false} />
                <WebsiteButton urlForBuilding={contact.urlForBuilding} />
                <SaveButton
                  isSaved={true}
                  onClickCallback={handleToggleSaveBuilding}
                />
              </Stack>
            ) : (
              <Stack direction={"horizontal"} gap={2}>
                <ListingButton listing={listing} isMarker={false} />
                <WebsiteButton urlForBuilding={contact.urlForBuilding} />
                <SaveButton
                  isSaved={false}
                  onClickCallback={handleToggleSaveBuilding}
                />
              </Stack>
            )
          ) : (
            <Stack direction={"horizontal"} gap={2}>
              <ListingButton listing={listing} isMarker={false} />
              <WebsiteButton urlForBuilding={contact.urlForBuilding} />
              <SaveButton isSaved={false} onClickCallback={handleShowLogin} />
            </Stack>
          )}
        </div>
      </Card.Header>

      <ListGroup variant="flush" className="mb-2">
        {!listing ||
          (listing.listingStatus !== listingStatusEnum.ACTIVE && (
            <ListGroup.Item>
              Contact building for current availability.
            </ListGroup.Item>
          ))}

        <ListGroup.Item>
          <Tabs
            className="tabs"
            defaultActiveKey={
              listing?.listingStatus === listingStatusEnum.ACTIVE
                ? "available"
                : "contact"
            }
          >
            {listing?.listingStatus === listingStatusEnum.ACTIVE &&
              listing?.availDataArray && (
                <Tab eventKey="available" title="Available" className="mt-2">
                  <BuildingDataTable
                    type={tableType.availData}
                    data={listing.availDataArray}
                    program={listing.program}
                  />
                  {listing.description && (
                    <Card.Text className="mt-2">
                      <strong>Description:</strong> {listing.description}
                    </Card.Text>
                  )}
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
                <BuildingDataTable type={tableType.amiData} data={amiData} />
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
