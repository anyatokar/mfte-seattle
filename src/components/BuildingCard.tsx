import { useState, useContext, Fragment } from "react";

import { areListingsOn } from "../config/config";
import { pageTypeEnum } from "../types/enumTypes";

import { AddressAndPhone } from "./BuildingContactInfo";
import ListingButton from "./ListingButton";

import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import { timestampToDate, timestampToDateAndTime } from "../utils/generalUtils";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import IBuilding, { AMIPercentage } from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IListing from "../interfaces/IListing";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
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
    totalRestrictedUnits,
    sedu,
    studioUnits,
    oneBedroomUnits,
    twoBedroomUnits,
    threePlusBedroomUnits,
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

  const availabilityData = [
    {
      type: "Micro",
      quantity: listing?.seduAvail?.quantity,
    },
    {
      type: "Studio",
      quantity: listing?.studioAvail?.quantity,
    },
    {
      type: "One",
      quantity: listing?.oneBedAvail?.quantity,
    },
    {
      type: "Two",
      quantity: listing?.twoBedAvail?.quantity,
    },
    {
      type: "Three+",
      quantity: listing?.threePlusBedAvail?.quantity,
    },
  ];

  function renderPercentageList(percentages: AMIPercentage[]): React.ReactNode {
    if (!percentages) return null;

    return percentages.map((item, index) => (
      <Fragment key={index}>
        {item}
        {index < percentages.length - 1 ? ", " : ""}
      </Fragment>
    ));
  }

  const websiteButton = (
    <Button
      className="diy-outline-info-button me-2"
      size="sm"
      id="leasing-page-url"
      href={urlForBuilding}
      title={`Open new tab: ${urlForBuilding}`}
      target="_blank"
      rel="noreferrer"
      variant="primary"
    >
      Website
    </Button>
  );

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mt-2">
          <div>
            {buildingName}
            {areListingsOn && listing?.hasAnyAvailability && (
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
                  {websiteButton}
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
                  {websiteButton}
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
                {websiteButton}
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
            {websiteButton}
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
        {!areListingsOn ||
          ((!listing || !listing.hasAnyAvailability) && (
            <ListGroup.Item>
              Contact building for current availability.
            </ListGroup.Item>
          ))}

        <ListGroup.Item>
          <Tabs
            className="tabs"
            defaultActiveKey={
              areListingsOn && listing?.hasAnyAvailability
                ? "availability"
                : "contact"
            }
          >
            {areListingsOn && listing?.hasAnyAvailability && (
              <Tab eventKey="availability" title="Availability">
                <Table bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Bedrooms</th>
                      <th>Available Units</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilityData.map(
                      (apt) =>
                        apt.quantity && (
                          <tr key={apt.type}>
                            <td>{apt.type}</td>
                            <td>{apt.quantity}</td>
                          </tr>
                        )
                    )}
                  </tbody>
                </Table>
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
                <Table bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>Bedrooms</th>
                      <th>% of AMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amiData.micro && (
                      <tr>
                        <td>Micro</td>
                        <td>{renderPercentageList(amiData.micro)}</td>
                      </tr>
                    )}
                    {amiData.studio && (
                      <tr>
                        <td>Studio</td>
                        <td>{renderPercentageList(amiData.studio)}</td>
                      </tr>
                    )}
                    {amiData.oneBed && (
                      <tr>
                        <td>One</td>
                        <td>{renderPercentageList(amiData.oneBed)}</td>
                      </tr>
                    )}
                    {amiData.twoBed && (
                      <tr>
                        <td>Two</td>
                        <td>{renderPercentageList(amiData.twoBed)}</td>
                      </tr>
                    )}
                    {amiData.threePlusBed && (
                      <tr>
                        <td>Three+</td>
                        <td>{renderPercentageList(amiData.threePlusBed)}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
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
