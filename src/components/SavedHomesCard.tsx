import { useState } from "react";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact"

export function SavedHomesCard(props: IBuilding) {
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

  // Note form
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
          <MDBCloseIcon onClick={deleteBuilding}/>
          <Card.Title>
            <a id="buildingLink" 
              href={urlForBuilding} 
              target="_blank" 
              rel="noreferrer">
              {buildingName}
            </a>
          </Card.Title>
          <h6>{residentialTargetedArea}</h6>
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
              <Form.Group>
                <Form.Control 
                  as="textarea"
                  name="note"
                  rows={3}
                  value={noteToAdd}
                  placeholder="Your notes here"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="primary" size="sm" type="submit" value="Submit">Update Note</Button>
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
