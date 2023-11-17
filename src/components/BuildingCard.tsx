import { useState, useContext } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, Form, Button, Table, Tabs, Tab } from "react-bootstrap";
import ISavedBuilding from "../interfaces/ISavedBuilding";
import IBuilding from "../interfaces/IBuilding";
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { AddressAndPhone, BuildingName } from "./BuildingContactInfo";
import { addNote } from "../utils/firestoreUtils";

export interface AllBuildingsCardProps extends IBuilding {
  isSaved: boolean;
  pageType: "allBuildings";
}

export interface SavedBuildingsCardProps extends ISavedBuilding {
  pageType: "savedBuildings";
}

type BuildingsCardProps = AllBuildingsCardProps | SavedBuildingsCardProps;

export function BuildingCard(props: BuildingsCardProps) {
  const { currentUser } = useAuth() as any;
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
  } = props;

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  let wasOriginallySaved = false;
  let note: string | undefined;
  let noteTimestamp: string | undefined;

  if (pageType === "allBuildings") {
    wasOriginallySaved = props.isSaved;
  } else if (pageType === "savedBuildings") {
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
    return addNote(currentUser.uid, buildingID, noteToAdd)
      .then(() => {
        setIsNoteDifferent(false);
        console.log("Note successfully updated!");
      })
      .catch((error: any) => {
        console.error("Error updating document: ", error);
      });
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          <BuildingName buildingName={buildingName} urlForBuilding={urlForBuilding} />
        </Card.Title>
        <Card.Subtitle>{residentialTargetedArea}</Card.Subtitle>
        <div className="mt-2">
          {pageType === "allBuildings" &&
            (currentUser ? (
              wasOriginallySaved || isSaved ? (
                <Button variant="btn btn-info btn-sm" onClick={toggleSave} role="button">
                  Saved
                </Button>
              ) : (
                <Button variant="btn btn-outline-info btn-sm" onClick={toggleSave} role="button">
                  Save
                </Button>
              )
            ) : (
              <Button onClick={handleShowLogin} variant="btn btn-outline-info btn-sm">
                Save
              </Button>
            ))}
        </div>
        {pageType === "savedBuildings" && (
          <Button
            className="btn-sm center"
            variant="outline-danger"
            title={`Remove ${buildingName} from saved buildings list`}
            type="button"
            value="Remove"
            onClick={() => {
              deleteBuilding(currentUser, buildingID, buildingName);
            }}
          >
            Remove
          </Button>
        )}
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
            {pageType === "savedBuildings" && (
              <>
                <Form onSubmit={handleSubmit} className="notes-form">
                  <Form.Label>Notes</Form.Label>
                  <Form.Group>
                    <Form.Control as="textarea" name="note" rows={3} value={noteToAdd} onChange={handleChange} />
                  </Form.Group>
                  <Button
                    disabled={!isNoteDifferent}
                    variant="info"
                    type="submit"
                    title={`Save or update your note!`}
                    value="Save note"
                    className="btn-sm notes-form-btn"
                  >
                    Save note
                  </Button>
                  {noteTimestamp && <p>{`Last saved: ${noteTimestamp}`}</p>}
                </Form>
              </>
            )}
          </Tab>
          <Tab eventKey="link" title="Details">
            <Table bordered hover size="sm">
              <thead>
                <tr>
                  <th>Bedrooms</th>
                  <th># of MFTE Units*</th>
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
            <div>*Contact building for current availability.</div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
}
