import React, { useState } from "react";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { Card, ListGroup, ListGroupItem, Button, Modal } from 'react-bootstrap';
import Login from "../auth_components/Login"

export function AllBuildingsCard(props: IBuilding) {

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
    lat, 
    lng
  } = props;

  function saveBuilding(e: any) {
    firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").doc(buildingID).set(
      {
        // could not access data from buildingRef code below
        // buildingRef: firebase.firestore().collection("buildings").doc(buildingID)
        "buildingID": buildingID,
        "buildingName": buildingName,
        "phone": phone,
        "residentialTargetedArea": residentialTargetedArea,
        "totalRestrictedUnits": totalRestrictedUnits,
        "sedu": sedu,
        "studioUnits": studioUnits,
        "oneBedroomUnits": oneBedroomUnits, 
        "twoBedroomUnits": twoBedroomUnits,
        "threePlusBedroomUnits": threePlusBedroomUnits,
        "urlForBuilding": urlForBuilding,
        "streetNum": streetNum,
        "street": street, 
        "city": city,
        "state": state, 
        "zip": zip,
        "lat": lat,
        "lng": lng, 
      })
    .then(() => {
      console.log("Building saved to user");
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }

  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);
  return (
    <div className="building-card">
      <Card>
        <Card.Img variant="top" src="" />
        <Card.Body>
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
            {streetNum} {street}
            <br></br>
            <p>{city}, {state} {zip}</p>
            <p>{phone}</p>
          </Card.Text>
          { currentUser ? (
            <Button variant="btn btn-outline-warning btn-sm standalone-btn"
              onClick={saveBuilding}
              role="button">
              Save
            </Button>
            ) : (
            <>
              <Button onClick={handleShowLogin}  variant="btn btn-outline-warning btn-sm standalone-btn">Save</Button>
              <Modal show={showLogin} onHide={handleCloseLogin}>
                <Login />
              </Modal>
            </>
            )
          }
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>
            <h6> Total MFTE Units: {totalRestrictedUnits}</h6>
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