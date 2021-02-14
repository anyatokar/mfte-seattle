import React, { useState } from "react"
import { Card, Button, Alert, Modal, Nav, Tab, Row, Col } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { render } from "@testing-library/react"
import Login from "../auth_components/Login"
import UpdateProfile from "../auth_components/UpdateProfile"
import Profile from "../auth_components/Profile"


import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { useCallback } from 'react';
// import IPage from '../interfaces/page';
// import logging from '../config/logging';
// import { RouteComponentProps, withRouter } from 'react-router-dom';
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import firebase from '../db/firebase';
import 'firebase/firestore';


import Sorters from "../components/Sorters";
import SearchInput from "../components/SearchInput";
import { SavedHomesCard } from "../components/SavedHomesCard";
import IBuilding from "../interfaces/IBuilding";
// import buildings from "../db/buildings";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";
import SavedHomesMap from "../components/SavedHomesMap"


import SavedHomesList from '../components/SavedHomesList';
// import SavedSearchesPage from '../components/saved-searches';


const SavedByUserPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [error, setError] = useState("")
  const { currentUser, logout } = useAuth() as any
  const history = useHistory()

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
                <Nav.Link eventKey="update" className="tab">Map View</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="third" className="tab">Tab 3</Nav.Link>
              </Nav.Item> */}
            </Nav>
            </Col>
            <Col sm={9} className="profile-email">
            <Tab.Content>
              <Tab.Pane eventKey="saved-homes">
                {/* <h3>Profile</h3> */}
                
                <SavedHomesList />
              </Tab.Pane>
              <Tab.Pane eventKey="update">
              {/* <h3 className="display-6">Update</h3> */}
              <SavedHomesMap/>
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
