import { useState, useContext } from "react";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, Form, Button, Table, Tabs, Tab } from 'react-bootstrap';
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IBuilding from "../interfaces/IBuilding";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { AddressAndPhone, BuildingName } from './BuildingContactInfo';
import { timestampPT } from "../utils/generalUtils";

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
  let noteTimestamp: string | undefined;

  if (pageType === "allBuildings" ) {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === "savedHomes") {
    note = props.note;
    noteTimestamp = props.noteTimestamp;
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
  // Only enable button if updated note is different from saved note.
  const [isNoteDifferent, setIsNoteDifferent] =useState(false)

  const handleChange = (event: any) => {
    console.log("note", note)
    event.target.value !== note ? setIsNoteDifferent(true) : setIsNoteDifferent(false);
    setNoteToAdd(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (noteToAdd !== undefined && isNoteDifferent) {
      updateNote(noteToAdd)
      setIsNoteDifferent(false)
    }
  };

  const updateNote = (noteToAdd: string) => {
    const savedHome = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").where('buildingID','==', buildingID)
    savedHome.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        return doc.ref.update({
          note: noteToAdd,
          noteTimestamp: timestampPT
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

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <BuildingName
            buildingName={buildingName}
            urlForBuilding={urlForBuilding}
          />
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
              {pageType === "savedHomes" &&
              <>
                <Form onSubmit={handleSubmit} className="notes-form">
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
                    disabled={!isNoteDifferent}
                    variant="info"
                    type="submit"
                    title={`Save or update your note!`}
                    value="Save note"
                    className="btn-sm notes-form-btn">
                      Save note
                  </Button>
                  {noteTimestamp && <p>{`Last saved: ${noteTimestamp}`}</p>}
                </Form>
              </>
              }
            </Tab>
            <Tab eventKey="link" title="# of Units">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Apt Size</th>
                    <th># of Units*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Pod</td>
                    <td>{sedu}</td>
                  </tr>
                  <tr>
                    <td>Studio</td>
                    <td>{studioUnits}</td>
                  </tr>
                  <tr>
                    <td>One bedroom</td>
                    <td>{oneBedroomUnits}</td>
                  </tr>
                  <tr>
                    <td>Two bedroom</td>
                    <td>{twoBedroomUnits}</td>
                  </tr>
                  <tr>
                    <td>Three+ bedroom</td>
                    <td>{threePlusBedroomUnits}</td>
                  </tr>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{totalRestrictedUnits}</strong></td>
                  </tr>
                </tbody>
              </Table>
              <p>*Column signifies # of MFTE units in the building. Contact buildings directly for current availability.</p>
            </Tab>
          </Tabs>
      </Card.Body>
    </Card>
  );
}
