import { useState, useContext } from "react";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase"
import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { Card, Button } from 'react-bootstrap';

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

  const [buttonFill, setButtonFill] = useState(false) as any

  function saveBuilding(e: any) {
    setButtonFill(true)
    firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").doc(buildingID).set(
      {
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

  const [/* modalState */, setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

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
            {city}, {state} {zip}
            <br></br>
            {phone}
          </Card.Text>
          { currentUser ? (
            buttonFill ?
              <Button 
                variant="btn btn-warning btn-sm btn-save-building-card"
                onClick={ saveBuilding }
                role="button">
                Saved
              </Button>
              :
              <Button 
                variant="btn btn-outline-warning btn-sm btn-save-building-card"
                onClick={saveBuilding}
                role="button">
                Save
              </Button>
            ) : (
            <>
              <Button onClick={ handleShowLogin } variant="btn btn-outline-warning btn-sm standalone-btn">
                Save
              </Button>
            </>
            )
          }
          <Card.Text>
            <br></br>
            Total MFTE Units: {totalRestrictedUnits}
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
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}