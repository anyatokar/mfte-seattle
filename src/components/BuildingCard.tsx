import { useState, useContext, Fragment } from "react";

import { areListingsOn } from "../config/config";
import { pageTypeEnum } from "../types/enumTypes";

import { AddressAndPhone, BuildingName } from "./BuildingContactInfo";
import { ListingCard } from "./ListingCard";

import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";
import { timestampToDate, timestampToDateAndTime } from "../utils/generalUtils";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import IBuilding, { AMIPercentage } from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IListing from "../interfaces/IListing";

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
    amiData1,
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
      type: "Pod",
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

  return (
    <Card>
      <Card.Header>
        <Card.Title className="mt-2">
          <BuildingName
            buildingName={buildingName}
            urlForBuilding={urlForBuilding}
          />
        </Card.Title>
        <Card.Subtitle>{residentialTargetedArea}</Card.Subtitle>
        <div className="mt-2">
          {pageType === pageTypeEnum.allBuildings &&
            (currentUser ? (
              wasOriginallySaved || isSaved ? (
                <Button
                  className="diy-solid-info-button"
                  size="sm"
                  onClick={toggleSave}
                >
                  Saved
                </Button>
              ) : (
                <Button
                  className="diy-outline-info-button"
                  size="sm"
                  onClick={toggleSave}
                >
                  Save
                </Button>
              )
            ) : (
              <Button
                className="diy-outline-info-button"
                onClick={handleShowLogin}
                size="sm"
              >
                Save
              </Button>
            ))}
        </div>

        {pageType === pageTypeEnum.savedBuildings && (
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
        )}
      </Card.Header>

      <ListGroup variant="flush">
        <ListGroup.Item
          className={
            areListingsOn && listing && listing.hasAnyAvailability
              ? "listing-card"
              : ""
          }
        >
          <ListingCard
            areListingsOn={areListingsOn}
            listing={listing}
            isMarker={false}
          />
        </ListGroup.Item>

        <ListGroup.Item>
          <Tabs
            defaultActiveKey={
              areListingsOn && listing?.hasAnyAvailability
                ? "availability"
                : "contact"
            }
          >
            {areListingsOn && (
              <Tab
                eventKey="availability"
                title="Availability"
                disabled={!listing || (listing && !listing.hasAnyAvailability)}
              >
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
              </Tab>
            )}
            <Tab eventKey="contact" title="Contact">
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
            </Tab>

            <Tab eventKey="details" title="Details">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Bedrooms</th>
                    <th>Total MFTE Units</th>
                    {amiData1 ? <th>AMI %</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {sedu !== 0 && (
                    <tr>
                      <td>Pod</td>
                      <td>{sedu}</td>
                      {amiData1 ? (
                        <td>{renderPercentageList(amiData1?.micro)}</td>
                      ) : null}
                    </tr>
                  )}
                  {studioUnits !== 0 && (
                    <tr>
                      <td>Studio</td>
                      <td>{studioUnits}</td>
                      {amiData1 ? (
                        <td>{renderPercentageList(amiData1?.studio)}</td>
                      ) : null}
                    </tr>
                  )}
                  {oneBedroomUnits !== 0 && (
                    <tr>
                      <td>One</td>
                      <td>{oneBedroomUnits}</td>
                      {amiData1 ? (
                        <td>{renderPercentageList(amiData1?.oneBed)}</td>
                      ) : null}
                    </tr>
                  )}
                  {twoBedroomUnits !== 0 && (
                    <tr>
                      <td>Two</td>
                      <td>{twoBedroomUnits}</td>
                      {amiData1 ? (
                        <td>{renderPercentageList(amiData1?.twoBed)}</td>
                      ) : null}
                    </tr>
                  )}
                  {threePlusBedroomUnits !== 0 && (
                    <tr>
                      <td>Three+</td>
                      <td>{threePlusBedroomUnits}</td>
                      {amiData1 ? (
                        <td>{renderPercentageList(amiData1?.threePlusBed)}</td>
                      ) : null}
                    </tr>
                  )}
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{totalRestrictedUnits}</strong>
                    </td>
                    {amiData1 ? <td></td> : null}
                  </tr>
                </tbody>
              </Table>
            </Tab>
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
