import { useEffect } from 'react';
import { useState, useCallback } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';
import { SavedHomesCard } from "./SavedHomesCard";
import IBuilding from "../interfaces/IBuilding";
import { useAuth } from "../contexts/AuthContext"

import { Container, Row, Col } from 'react-bootstrap';

export default function SavedHomesList() {
  const { currentUser } = useAuth() as any
  const ref = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes")
  const [savedBuildings, setBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getBuildings()}, [getBuildings]); 

  return (
    <>
      <Container>
        <Row className="show-grid">
          <Col lg={12}>
            <Row className="show-grid">
                {savedBuildings.length > 0 && (
                  <>
                    {savedBuildings.map((building) => (
                      <>
                      <Col md={4}  className="building-row">
                        <SavedHomesCard key={building.buildingID} {...building} />
                      </Col>
                      </>
                    ))}
                  </>
                )}
                {savedBuildings.length === 0 && <p>No saved buildings yet</p>}
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}