import { useState, useContext, useEffect } from "react";

import { areListingsOn } from "../config/config";
import { listingStatusEnum, tableType } from "../types/enumTypes";

import { AddressAndPhone } from "./BuildingContactInfo";
import BuildingDataTable from "./BuildingDataTable";
import ListingButton from "./ListingButton";
import SaveButton from "./SaveButton";
import WebsiteButton from "./WebsiteButton";

import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import useDebounce from "../hooks/useDebounce";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import IBuilding from "../interfaces/IBuilding";

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
}

const BuildingCard: React.FC<AllBuildingCardProps> = ({ building }) => {
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
    savedData,
  } = building;

  const { currentUser } = useAuth();

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = !!savedData;
  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      setUpdatedNote("");
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser?.uid, building);
    }
  }

  // Saved Buildings - note form
  const originalNote = savedData?.note || "";
  const [updatedNote, setUpdatedNote] = useState(originalNote);

  // This runs every time component re-renders (on every keystroke).
  // But it only updates when user stops typing.
  const debouncedNote = useDebounce(updatedNote, 1000);

  useEffect(() => {
    if (debouncedNote !== undefined && debouncedNote !== originalNote) {
      handleNoteUpdate(debouncedNote);
    }
  }, [debouncedNote]);

  async function handleNoteUpdate(debouncedNote: string): Promise<void> {
    return addNote(currentUser?.uid, buildingID, debouncedNote)
      .then(() => {
        console.log("Note updated successfully.");
      })
      .catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  }

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
          {currentUser ? (
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
          )}
        </div>
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
        {wasOriginallySaved || isSaved ? (
          <ListGroup.Item>
            <Form>
              <Form.Label>Notes</Form.Label>
              <Form.Group className="mb-2">
                <Form.Control
                  as="textarea"
                  name="note"
                  rows={2}
                  value={updatedNote}
                  onChange={(e) => setUpdatedNote(e.target.value)}
                />
              </Form.Group>
            </Form>
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </Card>
  );
};

export default BuildingCard;
