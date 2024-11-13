import { Profiler } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { isProfilerOn } from "../config/config";
import IPage from "../interfaces/IPage";
import { accountTypeEnum, pageTypeEnum } from "../types/enumTypes";

import { useSavedBuildings } from "../hooks/useSavedBuildings";
import { useAllListings } from "../hooks/useListings";

import ReactMap from "../map/ReactMap";
import AllBuildingsList from "../components/BuildingsList";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Spinner from "react-bootstrap/Spinner";

const SavedBuildingsPage: React.FC<IPage> = ({ name }) => {
  const { currentUser, accountType } = useAuth();
  const [savedBuildings, isLoadingSavedBuildings] = useSavedBuildings();
  const [allListings, isLoadingAllListings] = useAllListings(true);

  if (!currentUser || accountType !== accountTypeEnum.RENTER) {
    return null;
  }

  const loading = isLoadingSavedBuildings || isLoadingAllListings;

  return (
    <Profiler
      id={name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
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
                      <Link id="all-buildings" to="./all-buildings">
                        MFTE map
                      </Link>
                      .
                    </p>
                  </>
                )}
                <Tab.Pane eventKey="map">
                  <ReactMap
                    resultBuildingsUnsorted={savedBuildings}
                    savedBuildings={savedBuildings}
                    allListings={allListings}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <AllBuildingsList
                    resultBuildingsUnsorted={savedBuildings}
                    savedBuildings={savedBuildings}
                    allListings={allListings}
                    pageType={pageTypeEnum.savedBuildings}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Profiler>
  );
};

export default SavedBuildingsPage;
