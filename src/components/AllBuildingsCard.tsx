import { useState, useContext } from "react";
import IBuilding from "../interfaces/IBuilding";
import { useAuth } from "../contexts/AuthContext";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import { Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { saveBuilding, deleteBuilding } from "../utils/firestoreUtils";

export interface AllBuildingsCardProps extends IBuilding {
  isSaved: boolean
}

export function AllBuildingsCard(props: AllBuildingsCardProps) {
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
    isSaved: wasOriginallySaved
  } = props;

  const [/* modalState */, setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  const mapViewUrl = `https://www.google.com/maps/search/?api=1&query=${streetNum}+${street}+${city}+${state}+${zip}`;
  const phone1Ref = `tel:${phone}`
  const phone2Ref = `tel:${phone2}`

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
              <br />
              {city}, {state} {zip}
            </a>
            <br />
            <a href={phone1Ref}>
              {phone}
            </a>
            {
              phone2 &&
              <>
                <br />
                <a href={phone2Ref}>
                  {phone2}
                </a>
              </>
            }
          </ListGroupItem>
          <ListGroupItem>
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
          </ListGroupItem>
        </ListGroup>
      </Card>
    </div>
  );
};
