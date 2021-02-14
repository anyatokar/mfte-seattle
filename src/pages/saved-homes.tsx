import React, { useState, useEffect } from "react";
import { Button, Modal, Nav, Tab, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";
import Login from "../auth_components/Login";
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useCallback } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';
import IBuilding from "../interfaces/IBuilding";
import MapTab from "../components/MapTab";
import SavedHomesList from '../components/SavedHomesList';
import { Spinner } from "react-bootstrap"

const SavedByUserPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

  const ref = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes")
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getSavedBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setSavedBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getSavedBuildings()}, [getSavedBuildings]); 

  async function handleLogout() {
    setError("")

    try {
      await logout()
      history.push("./")
    } catch {
      setError("Failed to log out")
    }
  }

  // Login
  const [showLogin, setShowLogin] = useState(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="warning" />
        ) : ('')
      }

      {currentUser
        ? (
        <>
          <Tab.Container id="sidebar" defaultActiveKey="saved-homes">
            <Row>
              <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="saved-homes" className="tab">Saved Homes</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="map" className="tab">Map</Nav.Link>
                </Nav.Item>
              </Nav>
              </Col>
              <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="saved-homes">
                  <SavedHomesList savedBuildings={savedBuildings}/>
                </Tab.Pane>
                <Tab.Pane eventKey="map">
                  <MapTab savedBuildings={savedBuildings}/>
                </Tab.Pane>
              </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </>
        ) : (
        <>
          <Button onClick={handleShowLogin} variant="info">Saved Homes</Button>
          <Modal show={showLogin} onHide={handleCloseLogin}>
            <Login />
          </Modal>
        </>
        )
      }
    </>
  )
}

export default withRouter(SavedByUserPage);
