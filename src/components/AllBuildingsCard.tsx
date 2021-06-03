import { useState, useContext } from "react";
import IBuilding from "../interfaces/IBuilding";
import firebase from "../db/firebase";
import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

export function AllBuildingsCard(props: IBuilding) {
  const {currentUser} = useAuth() as any;
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
    lat, 
    lng
  } = props;

  const [buttonFill, setButtonFill] = useState(false) as any;

  function saveBuilding(e: any) {
    setButtonFill(true);
    firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes").doc(buildingID)
    .set({
        "buildingID": buildingID,
        "buildingName": buildingName,
        "phone": phone,
        "phone2": phone2,
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
  };

  const [/* modalState */, setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${streetNum}+${street}+${city}+${state}+${zip}`;

  return (
    <div>
      <Card>
        <Card.Header>
          <Card.Title>
            <a id="buildingLink" 
              href={urlForBuilding} 
              target="_blank" 
              rel="noreferrer">
              {buildingName}
            </a>
          </Card.Title>
          <h6>{residentialTargetedArea}</h6>
          { currentUser ? (
            buttonFill ?
              <Button 
                variant="btn btn-info btn-sm btn-save-building-card"
                onClick={saveBuilding}
                role="button">
                Saved
              </Button>
              :
              <Button 
                variant="btn btn-outline-info btn-sm btn-save-building-card"
                onClick={saveBuilding}
                role="button">
                Save
              </Button>
            ) : (
            <>
              <Button onClick={handleShowLogin} variant="btn btn-outline-info btn-sm standalone-btn">
                Save
              </Button>
            </>
            )
          }
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
            <a href=`tel:${phone}`>
              {phone}
            </a>
            {
              phone2 &&
              <>
                <br></br>
                <a href=`tel:${phone2}`>
                  {phone2}
                </a>
              </>
            }
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
};
