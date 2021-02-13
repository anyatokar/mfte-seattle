import React, { useState } from "react";
import Iframe from 'react-iframe'
import app from "../db/firebase";
// import Moment from "react-moment";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext"
import { Navbar, Nav, ButtonGroup, Button, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import Login from "../auth_components/Login"

export function BuildingCard(props: IBuilding) {
  const { currentUser } = useAuth() as any
  const {
    buildingID,
    buildingName,
    phone,
    residentialTargetedArea,
    totalRestrictedUnits,
    studioUnits,
    oneBedroomUnits, 
    twoBedroomUnits,
    threePlusBedroomUnits,
    urlforBuilding,
    streetNum,
    street, 
    city,
    state, 
    zip,
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
        "studioUnits": studioUnits,
        "oneBedroomUnits": oneBedroomUnits, 
        "twoBedroomUnits": twoBedroomUnits,
        "threePlusBedroomUnits": threePlusBedroomUnits,
        "urlforBuilding": urlforBuilding,
        "streetNum": streetNum,
        "street": street, 
        "city": city,
        "state": state, 
        "zip": zip
      })
    .then(() => {
      
      console.log("Building saved to user");
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
  }

  //   firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").add(
  //     {buildingName: buildingName
  //     })
  //   .then((docRef) => {
      
  //     console.log("Document written with ID: ", docRef.id);
  // })
  // .catch((error) => {
  //     console.error("Error adding document: ", error);
  // });
  // }

  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  return (
    <div>
      <div className="card-body">
        {/* <h4 className="card-title">{<a href={urlforBuilding}>{buildingName}</a>}</h4> */}
        <h4 className="card-title">{
          <a id="myLink" 
            href={urlforBuilding} 
            target="_blank" 
            rel="noreferrer">
            {buildingName}
          </a>}
        </h4>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <div className="card-text"> 
              <h6 className="card-title">{residentialTargetedArea}</h6>
                <text>{streetNum} {street}</text>
                <br></br>
                <p>{city}, {state} {zip}</p>
                <p>{phone}</p>
              </div>
            </div>

            <div className="col">
              <h6> Total MFTE Units: {totalRestrictedUnits}</h6>
                <text> Studios: {studioUnits}</text>
                <br></br>
                <text>One beds: {oneBedroomUnits}</text>
                <br></br>
                <text>Two beds: {twoBedroomUnits}</text>
                <br></br>
                <text>Three+ beds: {threePlusBedroomUnits}</text>
            </div>

            <div className="col-3">
            <a className="btn btn-outline-secondary btn-sm standalone-btn" 
              href={urlforBuilding} 
              target="_blank" 
              rel="noreferrer">
              Open Website
            </a>

            { currentUser ? (
              <Button variant="btn btn-outline-warning btn-sm standalone-btn"
                              // href={urlforBuilding} 
                onClick={saveBuilding}
                role="button">
                Save to List
              </Button>
              ) : (
                <>
              <Button onClick={handleShowLogin}  variant="btn btn-outline-warning btn-sm standalone-btn">Saved Searches</Button>
                <Modal show={showLogin} onHide={handleCloseLogin}>
                  <Login />
                </Modal>
                </>
              )
            }
            </div>
          </div>
        </div>
      </div>
        <div className="card-footer text-muted text-right">
        {/* <span className="float-left">{<a href={urlforBuilding}>{urlforBuilding}</a>}</span>  */}
      </div>
    </div>
  );
}