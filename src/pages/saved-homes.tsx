import React from "react";
import { Nav, Tab, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import IPage from '../interfaces/IPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MapTab from "../components/MapTab";
import SavedHomesList from '../components/SavedHomesList';
import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { Spinner } from "react-bootstrap"

const SavedByUserPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const { currentUser } = useAuth() as any
  const [savedBuildings, loading] = useSavedBuildings();

  if (!currentUser) {
    return null;
  }

  return (
    <>
      {
        loading && <Spinner animation="border" variant="warning" />
      }
      <Tab.Container id="sidebar" defaultActiveKey="list">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab">Map</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="list" className="tab">List</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="map">
              <MapTab savedBuildings={savedBuildings}/>
            </Tab.Pane>
            <Tab.Pane eventKey="list">
              <SavedHomesList savedBuildings={savedBuildings}/>
            </Tab.Pane>

          </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  )
}

export default withRouter(SavedByUserPage);
