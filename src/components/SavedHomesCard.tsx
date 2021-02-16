import React, { useState } from "react";
// import Moment from "react-moment";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup, ListGroupItem, Form, Button } from 'react-bootstrap';
import { MDBCloseIcon } from "mdbreact"

export function SavedHomesCard(props: IBuilding) {
  const { currentUser } = useAuth() as any
  const {
    buildingID,
    buildingName,
    phone,
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
    updateNote(noteToAdd);
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

  return (
    <div className="building-card">
      <Card>
        <Card.Img variant="top" src="" />
        <Card.Body>
          <MDBCloseIcon onClick={deleteBuilding}/>
          <Card.Title>
            <h5 className="card-title"> {
              <a id="myLink" 
                href={urlForBuilding} 
                target="_blank" 
                rel="noreferrer">
                {buildingName}
              </a>
            }</h5>
          </Card.Title>
          <Card.Text>
          <h6 className="card-title">{residentialTargetedArea}</h6>
            <text>{streetNum} {street}</text>
              <br></br>
              <p>{city}, {state} {zip}</p>
              <p>{phone}</p>
          </Card.Text>
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
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <h6> Total MFTE Units: {totalRestrictedUnits}</h6>
            <text> Pods: {sedu}</text>
            <br></br>
            <text> Studios: {studioUnits}</text>
            <br></br>
            <text>One beds: {oneBedroomUnits}</text>
            <br></br>
            <text>Two beds: {twoBedroomUnits}</text>
            <br></br>
            <text>Three+ beds: {threePlusBedroomUnits}</text>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  );
}