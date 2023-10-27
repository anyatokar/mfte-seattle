import { useState, useContext } from "react";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, Form, Button, ListGroup, ListGroupItem, Nav, Tabs, Tab } from 'react-bootstrap';
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IBuilding from "../interfaces/IBuilding";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import { ModalContext, ModalState } from "../contexts/ModalContext";

export interface AllBuildingsCardProps extends IBuilding {
  isSaved: boolean
  pageType: "allBuildings"
}

export interface SavedHomesCardProps extends ISavedBuilding {
  pageType: "savedHomes"
}

type BuildingsCardProps= AllBuildingsCardProps | SavedHomesCardProps;

export function BuildingCard(props: BuildingsCardProps) {
  const { currentUser } = useAuth() as any
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
    pageType
  } = props;

  // All Buildings Page - save/saved button
  const [/* modalState */, setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = false;
  let note: string | undefined;

  if (pageType === "allBuildings" ) {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === "savedHomes") {
    note = props.note;
  }

  const [isSaved, setIsSaved] = useState(wasOriginallySaved);

  function toggleSave() {
    if (wasOriginallySaved || isSaved) {
      setIsSaved(false);
      deleteBuilding(currentUser, buildingID, buildingName);
    } else {
      setIsSaved(true);
      saveBuilding(currentUser, props);
    }
  };

  // Saved Homes Page - note form
  const [noteToAdd, setNoteToAdd] = useState(note)

  const handleChange = (event: any) => {
    setNoteToAdd(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (noteToAdd !== undefined) { updateNote(noteToAdd) }
  };

  const updateNote = (noteToAdd: string) => {
    const savedHome = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").where('buildingID','==', buildingID)
    savedHome.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        return doc.ref.update({
          note: noteToAdd
        })
        .then(() => {
          console.log("Note successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
      });
    });
  }

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${streetNum}+${street}+${city}+${state}+${zip}`;
  const phone1Ref = `tel:${phone}`
  const phone2Ref = `tel:${phone2}`

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <a id="buildingLink"
            href={urlForBuilding}
            title={`Open new tab: ${urlForBuilding}`}
            target="_blank"
            rel="noreferrer">
            {buildingName}
          </a>
        </Card.Title>
        <h6>{residentialTargetedArea}</h6>
        { pageType === "allBuildings" &&
          (currentUser ? (
            (wasOriginallySaved || isSaved) ?
              <Button 
                variant="btn btn-info btn-sm"
                onClick={toggleSave}
                role="button">
                Saved
              </Button>
              :
              <Button 
                variant="btn btn-outline-info btn-sm"
                onClick={toggleSave}
                role="button">
                Save
              </Button>
            ) : (
            <>
              <Button onClick={handleShowLogin} variant="btn btn-outline-info btn-sm">
                Save
              </Button>
            </>
            ))
          }
          { pageType === "savedHomes" &&
            <Button
              className="btn-sm center"
              variant="outline-danger"
              title={`Delete ${buildingName} from saved buildings list`}
              type="button"
              value="Unsave"
              onClick={() => {deleteBuilding(currentUser, buildingID, buildingName)}}
              >
              Unsave
            </Button>
          }
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey={"first"}>
            <Tab eventKey="first" title="Contact">
              <br />
              <a id="addressLink"
                  href={mapViewUrl}
                  title={`Open new tab: ${buildingName} on Google Maps`}
                  target="_blank"
                  rel="noreferrer">
                {streetNum} {street}
                <br />
                {city}, {state} {zip}
              </a>
              <br />
              {
                phone &&
                <>
                <br />
                  <a href={phone1Ref}
                    title={`Call ${buildingName}`}
                  >
                    {phone}
                  </a>
                </>
              }
              {
                phone2 &&
                <>
                  <br />
                  <a href={phone2Ref}
                    title={`Call ${buildingName}`}
                  >
                    {phone2}
                  </a>
                </>
              }
              {pageType === "savedHomes" &&
              <>
                <Form onSubmit={handleSubmit}>
                  <Form.Label>Notes</Form.Label>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      name="note"
                      rows={3}
                      value={noteToAdd}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Button
                    variant="info"
                    type="submit"
                    title={`Save or update your note!`}
                    value="Save note"
                    className="btn-sm notes-form-btn">
                      Save note
                  </Button>
                </Form>
              </>
              }
            </Tab>
            <Tab eventKey="link" title="AMI">
              <br />
              Total MFTE: {totalRestrictedUnits}
              <br />
              Pods: {sedu}
              <br />
              Studios: {studioUnits}
              <br />
              One beds: {oneBedroomUnits}
              <br />
              Two beds: {twoBedroomUnits}
              <br />
              Three+ beds: {threePlusBedroomUnits}
            </Tab>
          </Tabs>
      </Card.Body>
    </Card>
  );
}
