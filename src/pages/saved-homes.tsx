import React from "react";
import { Nav, Tab, Row, Col, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import IPage from '../interfaces/IPage';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MapTab from "../components/MapTab";
import SavedHomesList from '../components/SavedHomesList';
import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { Spinner } from "react-bootstrap";

const SavedByUserPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const { currentUser } = useAuth() as any
  const [savedBuildings, loading] = useSavedBuildings();

  if (!currentUser) {
    return null;
  }

  return (
    <div>
      <Container fluid className="pills-page">
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
                <Row>
                  {/* top margin size 3 for all screens (xs and up) | top margin size of 0 for medium screens and up */}
                  <Col className="mt-3 mt-md-0">
                    <p className="lead">Your List — your short list of apartment buildings.</p>
                    <p>The list and notes are private to your profile.</p>
                  </Col>
                </Row>
                {loading && <Spinner animation="border" variant="warning" />}
                {!loading && savedBuildings.length === 0 &&
                  <>
                    <br></br>
                    <p>Empty for now! To start your list, use the Save button in the&nbsp;
                      <a id="Buildings_tab"
                        href="./Buildings"
                        title="View the map of MFTE properties">
                        MFTE Map
                      </a>&nbsp;tab.
                    </p>
                  </>}
                <Tab.Pane eventKey="map">
                  <MapTab
                    buildingsToMap={savedBuildings}
                    savedBuildings={savedBuildings}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <SavedHomesList savedBuildings={savedBuildings}/>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  )
}

export default withRouter(SavedByUserPage);
