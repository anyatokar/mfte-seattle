import { isAdvertisingOn } from "../config/config";

import { useState, useContext } from "react";
import { AddressAndPhone, BuildingName } from "./BuildingContactInfo";
import { addNote, deleteBuilding, saveBuilding } from "../utils/firestoreUtils";

import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";

import { ListingCard } from "./ListingCard";

import IBuilding from "../interfaces/IBuilding";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IListing from "../interfaces/IListing";

import { pageTypeEnum } from "../types/enumTypes";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";
import Tabs from "react-bootstrap/Tabs";

export interface AllBuildingsCardProps extends IBuilding {
  isSaved: boolean;
  pageType: pageTypeEnum.allBuildings;
  listing: IListing | undefined;
}

export interface SavedBuildingsCardProps extends ISavedBuilding {
  pageType: pageTypeEnum.savedBuildings;
  listing: IListing | undefined;
}

type BuildingsCardProps = AllBuildingsCardProps | SavedBuildingsCardProps;

export function BuildingCard(props: BuildingsCardProps) {
  const { currentUser } = useAuth();
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
    pageType,
    /** An object containing listing metadata. */
    listing,
  } = props;

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = false;
  let note: string | undefined;
  let noteTimestamp: string | undefined;

  if (pageType === pageTypeEnum.allBuildings) {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === pageTypeEnum.savedBuildings) {
    note = props.note;
    noteTimestamp = props.noteTimestamp;
  }

  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      deleteBuilding(currentUser?.uid, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser?.uid, props);
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
          <BuildingName
            buildingName={buildingName}
            urlForBuilding={urlForBuilding}
          />
        </Card.Title>
        <Card.Subtitle>{residentialTargetedArea}</Card.Subtitle>
        <div className="mt-2">
          {pageType === "allBuildings" &&
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

        {pageType === "savedBuildings" && (
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
            isAdvertisingOn && listing && listing.hasAnyAvailability
              ? "listing-card"
              : ""
          }
        >
          <ListingCard isAdvertisingOn={isAdvertisingOn} listing={listing} />
        </ListGroup.Item>

        <ListGroup.Item>
          <Tabs
            defaultActiveKey={
              isAdvertisingOn && listing?.hasAnyAvailability
                ? "availability"
                : "contact"
            }
          >
            {isAdvertisingOn && (
              <Tab
                eventKey="availability"
                title="Availability"
                disabled={!listing || (listing && !listing.hasAnyAvailability)}
              >
                <Table bordered hover size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Bedrooms</th>
                      <th>Earliest Available Date</th>
                      <th>Rent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listing?.dateSeduAvailable && (
                      <tr>
                        <td>Pod</td>
                        <td>
                          {listing?.dateSeduAvailable
                            ?.toDate()
                            .toLocaleDateString() || "--"}
                        </td>
                        <td>{listing?.seduRent || "--"}</td>
                      </tr>
                    )}
                    {listing?.dateStudioAvailable && (
                      <tr>
                        <td>Studio</td>
                        <td>
                          {listing?.dateStudioAvailable
                            ?.toDate()
                            .toLocaleDateString() || "--"}
                        </td>
                        <td>{listing?.studioRent || "--"}</td>
                      </tr>
                    )}
                    {listing?.dateOneBedAvailable && (
                      <tr>
                        <td>One</td>
                        <td>
                          {listing?.dateOneBedAvailable
                            ?.toDate()
                            .toLocaleDateString() || "--"}
                        </td>
                        <td>{listing?.oneBedRent || "--"}</td>
                      </tr>
                    )}
                    {listing?.dateTwoBedAvailable && (
                      <tr>
                        <td>Two</td>
                        <td>
                          {listing?.dateTwoBedAvailable
                            ?.toDate()
                            .toLocaleDateString() || "--"}
                        </td>
                        <td>{listing?.twoBedRent || "--"}</td>
                      </tr>
                    )}
                    {listing?.dateThreePlusBedAvailable && (
                      <tr>
                        <td>Three+</td>
                        <td>
                          {listing?.dateThreePlusBedAvailable
                            ?.toDate()
                            .toLocaleDateString() || "--"}
                        </td>
                        <td>{listing?.threePlusBedRent || "--"}</td>
                      </tr>
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
              {pageType === "savedBuildings" && (
                <>
                  <Form onSubmit={handleSubmit}>
                    <Form.Label>Notes</Form.Label>
                    <Form.Group className="mb-2">
                      <Form.Control
                        as="textarea"
                        name="note"
                        rows={3}
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
                    {noteTimestamp && <p>{`Last saved: ${noteTimestamp}`}</p>}
                  </Form>
                </>
              )}
            </Tab>

            <Tab eventKey="details" title="Details">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Bedrooms</th>
                    <th># of MFTE Units</th>
                  </tr>
                </thead>
                <tbody>
                  {sedu !== 0 && (
                    <tr>
                      <td>Pod</td>
                      <td>{sedu}</td>
                    </tr>
                  )}
                  {studioUnits !== 0 && (
                    <tr>
                      <td>Studio</td>
                      <td>{studioUnits}</td>
                    </tr>
                  )}
                  {oneBedroomUnits !== 0 && (
                    <tr>
                      <td>One</td>
                      <td>{oneBedroomUnits}</td>
                    </tr>
                  )}
                  {twoBedroomUnits !== 0 && (
                    <tr>
                      <td>Two</td>
                      <td>{twoBedroomUnits}</td>
                    </tr>
                  )}
                  {threePlusBedroomUnits !== 0 && (
                    <tr>
                      <td>Three+</td>
                      <td>{threePlusBedroomUnits}</td>
                    </tr>
                  )}
                  <tr>
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>{totalRestrictedUnits}</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
          </Tabs>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
