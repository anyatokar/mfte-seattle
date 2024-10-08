import { useState, useContext } from "react";

import { areListingsOn } from "../config/config";
import { pageTypeEnum, tableType } from "../types/enumTypes";

import { AddressAndPhone } from "./BuildingContactInfo";
import ListingButton from "./ListingButton";
import BuildingDataTable from "./BuildingDataTable";
import WebsiteButton from "./WebsiteButton";

import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import { timestampToDateAndTime } from "../utils/generalUtils";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IListing from "../interfaces/IListing";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

export interface AllBuildingCardProps {
  building: IBuilding;
  isSaved: boolean;
  pageType: pageTypeEnum.allBuildings;
  listing: IListing | undefined;
}

export interface SavedBuildingCardProps {
  building: ISavedBuilding;
  isSaved: boolean;
  pageType: pageTypeEnum.savedBuildings;
  listing: IListing | undefined;
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
  } = props.building;

  const { pageType, listing } = props;

  const { currentUser } = useAuth();

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = false;
  let note: string | undefined;
  let formattedTimestamp: string | null | undefined;

  if (pageType === pageTypeEnum.allBuildings) {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === pageTypeEnum.savedBuildings) {
    note = props.building.note;
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
  const [noteToAdd, setNoteToAdd] = useState(note);
  // Only enable button if updated note is different from saved note.
  const [isNoteDifferent, setIsNoteDifferent] = useState(false);

  const handleChange = (event: any) => {
    setIsNoteDifferent(event.target.value !== note);
    setNoteToAdd(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (noteToAdd !== undefined && isNoteDifferent) {
      updateNote(noteToAdd);
    }
  };

  const updateNote = (noteToAdd: string) => {
    return addNote(currentUser?.uid, buildingID, noteToAdd)
      .then(() => {
        setIsNoteDifferent(false);
        console.log("Note updated successfully.");
      })
      .catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mt-2">
          <div>
            {buildingName}
            {areListingsOn && listing?.isApproved && (
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
            (currentUser ? (
              wasOriginallySaved || isSaved ? (
                <>
                  <WebsiteButton urlForBuilding={urlForBuilding} />
                  <Button
                    className="diy-solid-info-button"
                    size="sm"
                    onClick={toggleSave}
                  >
                    Saved
                  </Button>
                </>
              ) : (
                <>
                  <WebsiteButton urlForBuilding={urlForBuilding} />
                  <Button
                    className="diy-outline-info-button"
                    size="sm"
                    onClick={toggleSave}
                  >
                    Save
                  </Button>
                </>
              )
            ) : (
              <>
                <WebsiteButton urlForBuilding={urlForBuilding} />
                <Button
                  className="diy-outline-info-button"
                  onClick={handleShowLogin}
                  size="sm"
                >
                  Save
                </Button>
              </>
            ))}
        </div>

        {pageType === pageTypeEnum.savedBuildings && (
          <>
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
          </>
        )}
      </Card.Header>

      <ListGroup variant="flush" className="mb-2">
        {(!areListingsOn || !listing || !listing.isApproved) && (
          <ListGroup.Item>
            Contact building for current availability.
          </ListGroup.Item>
        )}

        <ListGroup.Item>
          <Tabs
            className="tabs"
            defaultActiveKey={
              areListingsOn && listing?.isApproved ? "availability" : "contact"
            }
          >
            {areListingsOn && listing?.isApproved && listing?.availData && (
              <Tab eventKey="availability" title="Availability">
                <BuildingDataTable
                  type={tableType.availData}
                  data={listing.availData}
                />
                <ListingButton listing={listing} isMarker={false} />
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
              <Tab eventKey="details" title="Details">
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
                    value={noteToAdd}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button
                  disabled={!isNoteDifferent}
                  type="submit"
                  title={`Save or update your note!`}
                  value="Save note"
                  size="sm"
                  className="diy-solid-info-button"
                >
                  Save note
                </Button>
                <div>
                  {formattedTimestamp && (
                    <p>{`Last saved: ${formattedTimestamp}`}</p>
                  )}
                </div>
              </Form>
            </>
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );
};

export default BuildingCard;
