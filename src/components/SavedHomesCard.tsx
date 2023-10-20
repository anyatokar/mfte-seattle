import { useState } from "react";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, Col, Container, Form, Button, ListGroup, ListGroupItem, Row } from 'react-bootstrap';
import { XLg} from "react-bootstrap-icons"
import ISavedBuilding from "../interfaces/ISavedBuilding";

export function SavedHomesCard(props: ISavedBuilding) {
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
    note
  } = props;

  function deleteBuilding(e: any) {
    const savedHomesQuery = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").where('buildingID','==', buildingID);
    savedHomesQuery.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

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
    <div>
      <Card>
        <Card.Header>
          <Container fluid>
            <Row>
              <Col className="p-0">
                <Card.Title>
                  <a id="buildingLink" 
                    href={urlForBuilding} 
                    target="_blank" 
                    rel="noreferrer">
                    {buildingName}
                  </a>
                </Card.Title>
              </Col>
              <Col className="p-0 col-1">
                <XLg onClick={deleteBuilding} className="card-close-icon"/>
              </Col>
            </Row>
            <Row>
              <Col className="p-0">
                <h6>{residentialTargetedArea}</h6>
              </Col>
            </Row>
          </Container>
        </Card.Header>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <a id="addressLink"
                href={mapViewUrl}
                target="_blank" 
                rel="noreferrer">
              {streetNum} {street}
              <br></br>
              {city}, {state} {zip}
            </a>
            <br></br>
            <a href={phone1Ref}>
              {phone}
            </a>
            {
              phone2 &&
              <>
                <br></br>
                <a href={phone2Ref}>
                  {phone2}
                </a>
              </>
            }
          </ListGroupItem>
          <ListGroupItem>
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
                value="Submit"
                className="btn-sm notes-form-btn">
                  Update note
              </Button>
            </Form>
          </ListGroupItem>
          <ListGroupItem>
            Total MFTE: {totalRestrictedUnits}
            <br></br>
            Pods: {sedu}
            <br></br>
            Studios: {studioUnits}
            <br></br>
            One beds: {oneBedroomUnits}
            <br></br>
            Two beds: {twoBedroomUnits}
            <br></br>
            Three+ beds: {threePlusBedroomUnits}
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  );
}
