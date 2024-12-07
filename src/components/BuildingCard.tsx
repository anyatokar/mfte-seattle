import { useState, useContext } from "react";

import { areListingsOn } from "../config/config";
import {
  accountTypeEnum,
  listingStatusEnum,
  pageTypeEnum,
  tableType,
} from "../types/enumTypes";

import { AddressAndPhone } from "./BuildingContactInfo";
import BuildingDataTable from "./BuildingDataTable";
import ListingButton from "./ListingButton";
import SaveButton from "./SaveButton";
import WebsiteButton from "./WebsiteButton";

import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import { timestampToDateAndTime } from "../utils/generalUtils";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Stack from "react-bootstrap/Stack";

export interface AllBuildingCardProps {
  building: IBuilding;
  isSaved: boolean;
  pageType: pageTypeEnum.allBuildings;
}

export interface SavedBuildingCardProps {
  building: ISavedBuilding;
  isSaved: boolean;
  pageType: pageTypeEnum.savedBuildings;
}

type BuildingCardProps = AllBuildingCardProps | SavedBuildingCardProps;

const BuildingCard: React.FC<BuildingCardProps> = (props) => {
  const {
    buildingID,
    buildingName,
    phone,
    phone2,
    residentialTargetedArea,
    urlForBuilding,
    streetNum,
    street,
    city,
    state,
    zip,
    amiData,
    listing,
  } = props.building;

  const { pageType } = props;

  const { currentUser, accountType } = useAuth();

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = false;
  let originalNote: string | undefined;
  let formattedTimestamp: string | null | undefined;

  if (pageType === pageTypeEnum.allBuildings) {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === pageTypeEnum.savedBuildings) {
    originalNote = props.building.note;
    formattedTimestamp = props.building.noteTimestamp
      ? timestampToDateAndTime(props.building.noteTimestamp)
      : null;
  }

  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser?.uid, props.building);
    }
  }

  // Saved Buildings Page - note form
  const [updatedNote, setUpdatedNote] = useState(originalNote);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    updateNote(updatedNote || "");
  };

  const updateNote = (updatedNote: string) => {
    return addNote(currentUser?.uid, buildingID, updatedNote)
      .then(() => {
        console.log("Note updated successfully.");
      })
      .catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  };

  return (
    <Card
      border={
        areListingsOn && listing?.listingStatus === listingStatusEnum.ACTIVE
          ? "success"
          : ""
      }
    >
      <Card.Header>
        <Card.Title className="mt-2">
          <div>
            {buildingName}
            {areListingsOn &&
              listing?.listingStatus === listingStatusEnum.ACTIVE && (
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
        <Card.Subtitle>{residentialTargetedArea}</Card.Subtitle>
        <div className="mt-2">
          {pageType === pageTypeEnum.allBuildings &&
            accountType !== accountTypeEnum.MANAGER &&
            (currentUser ? (
              wasOriginallySaved || isSaved ? (
                <Stack direction={"horizontal"} gap={2}>
                  {" "}
                  <ListingButton listing={listing} isMarker={false} />
                  <WebsiteButton urlForBuilding={urlForBuilding} />
                  <SaveButton isSaved={true} onClickCallback={toggleSave} />
                </Stack>
              ) : (
                <Stack direction={"horizontal"} gap={2}>
                  <ListingButton listing={listing} isMarker={false} />
                  <WebsiteButton urlForBuilding={urlForBuilding} />
                  <SaveButton isSaved={false} onClickCallback={toggleSave} />
                </Stack>
              )
            ) : (
              <Stack direction={"horizontal"} gap={2}>
                <ListingButton listing={listing} isMarker={false} />
                <WebsiteButton urlForBuilding={urlForBuilding} />
                <SaveButton isSaved={false} onClickCallback={handleShowLogin} />
              </Stack>
            ))}
          {accountType === accountTypeEnum.MANAGER && (
            <Stack direction={"horizontal"} gap={2}>
              <ListingButton listing={listing} isMarker={false} />
              <WebsiteButton urlForBuilding={urlForBuilding} />
            </Stack>
          )}
        </div>

        {pageType === pageTypeEnum.savedBuildings && (
          <Stack direction={"horizontal"} gap={2}>
            <ListingButton listing={listing} isMarker={false} />
            <WebsiteButton urlForBuilding={urlForBuilding} />
            <Button
              className="center"
              size="sm"
              variant="outline-danger"
              title={`Remove ${buildingName} from saved buildings list`}
              type="button"
              value="Remove"
              onClick={() => {
                deleteBuilding(currentUser?.uid, buildingID, buildingName);
              }}
            >
              Remove
            </Button>
          </Stack>
        )}
      </Card.Header>

      <ListGroup variant="flush" className="mb-2">
        {(!areListingsOn ||
          !listing ||
          listing.listingStatus !== listingStatusEnum.ACTIVE) && (
          <ListGroup.Item>
            Contact building for current availability.
          </ListGroup.Item>
        )}

        <ListGroup.Item>
          <Tabs
            className="tabs"
            defaultActiveKey={
              areListingsOn &&
              listing?.listingStatus === listingStatusEnum.ACTIVE
                ? "availability"
                : "contact"
            }
          >
            {areListingsOn &&
              listing?.listingStatus === listingStatusEnum.ACTIVE &&
              listing?.availData && (
                <Tab
                  eventKey="availability"
                  title="Availability"
                  className="mt-2"
                >
                  <BuildingDataTable
                    type={tableType.availData}
                    data={listing.availData}
                    showListingForm={false}
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
                  streetNum={streetNum}
                  street={street}
                  city={city}
                  state={state}
                  zip={zip}
                  phone={phone}
                  phone2={phone2}
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
        {pageType === pageTypeEnum.savedBuildings && (
          <ListGroup.Item>
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Label>Notes</Form.Label>
                <Form.Group className="mb-2">
                  <Form.Control
                    as="textarea"
                    name="note"
                    rows={2}
                    value={updatedNote}
                    onChange={(event) => setUpdatedNote(event.target.value)}
                  />
                  {formattedTimestamp && (
                    <Form.Text>
                      Updated: {timestampToDateAndTime(formattedTimestamp)}
                    </Form.Text>
                  )}
                </Form.Group>
                <Button
                  disabled={updatedNote === originalNote}
                  type="submit"
                  title={`Save or update your note!`}
                  value="Save note"
                  size="sm"
                  className="diy-solid-info-button"
                >
                  Save note
                </Button>
              </Form>
            </>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default BuildingCard;
