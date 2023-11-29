import { useAuth } from "../contexts/AuthContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useSavedBuildings } from "../hooks/useSavedBuildings";

import MapTab from "../components/MapTab";
import SavedBuildingsList from "../components/SavedBuildingsList";

import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";

const SavedBuildingsPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = () => {
  const { currentUser } = useAuth() as any;
  const [savedBuildings, loading] = useSavedBuildings();

  if (!currentUser) {
    return null;
  }

  return (
    <Container fluid className="all-pages">
      <Tab.Container id="sidebar" defaultActiveKey="list">
        <Row>
          <Col sm={12} lg={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="map" className="tab">
                  Map
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="list" className="tab">
                  List
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={12} lg={10}>
            <Tab.Content>
              <Row>
                {/* top margin size 3 for all screens (xs and up) | top margin size of 0 for large screens and up */}
                <Col className="mt-2 mt-lg-0">
                  <p className="lead">
                    Saved buildings — your short list of apartment buildings.
                  </p>
                  <p>The list and notes are private to your profile.</p>
                </Col>
              </Row>
              {loading && <Spinner animation="border" variant="warning" />}
              {!loading && savedBuildings.length === 0 && (
                <>
                  <br />
                  <p>
                    Empty for now! To start your list, use the Save button on
                    the&nbsp;
                    <a id="Buildings_tab" href="./all-buildings">
                      MFTE map
                    </a>
                    .
                  </p>
                </>
              )}
              <Tab.Pane eventKey="map">
                <MapTab
                  buildingsToMap={savedBuildings}
                  savedBuildings={savedBuildings}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="list">
                <SavedBuildingsList savedBuildings={savedBuildings} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default withRouter(SavedBuildingsPage);
