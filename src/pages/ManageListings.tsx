import { Profiler, useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { isProfilerOn } from "../config/config";
import { listingStatusEnum } from "../types/enumTypes";
import { useAllListings } from "../hooks/useListings";
import { getRepsListingIDsFirestore } from "../utils/firestoreUtils";

import AddListingForm from "../components/AddListingWrapper";
import ListingCard from "../components/ListingCard";

import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";
import { useAllBuildings } from "../hooks/useAllBuildings";
import AddListingWrapper from "../components/AddListingWrapper";

const ManageListingsPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = ({ name }) => {
  const { currentUser } = useAuth();
  const [listingIDs, setListingIDs] = useState<string[] | null>(null);
  const [repsListings, isLoadingRepsListings] = useAllListings(listingIDs);
  const defaultActiveKey: string = "summary";
  const [activeTab, setActiveTab] = useState<string>(defaultActiveKey);

  const isAddListingTabActive = activeTab === "addListing";
  let [buildingsAlreadyFetched, setBuildingsAlreadyFetched] = useState(false);
  const [isEditing, setIsEditing] = useState(isAddListingTabActive);

  const [allBuildings, isLoadingAllBuildings] = useAllBuildings(
    isAddListingTabActive && !buildingsAlreadyFetched
  );

  useEffect(() => {
    if (allBuildings.length > 0) setBuildingsAlreadyFetched(true);
  }, [allBuildings]);

  useEffect(() => {
    const fetchListingIDs = async () => {
      if (!currentUser) return;
      const listingIDs = await getRepsListingIDsFirestore(currentUser.uid);
      setListingIDs(listingIDs);
    };

    fetchListingIDs();
  }, []);

  if (!currentUser) {
    return null;
  }

  let isLoading = isLoadingRepsListings;

  function getCount(label: listingStatusEnum): number {
    return repsListings.filter((listing) => listing.listingStatus === label)
      .length;
  }

  const summaryTableRows = [
    { label: "Active", listingStatus: listingStatusEnum.ACTIVE },
    {
      label: "In Review",
      listingStatus: listingStatusEnum.IN_REVIEW,
    },
    {
      label: "Needs Attention",
      listingStatus: listingStatusEnum.NEEDS_ATTENTION,
    },
    { label: "Archived", listingStatus: listingStatusEnum.ARCHIVED },
    { label: "Expiring Soon", listingStatus: listingStatusEnum.EXPIRING_SOON },
    { label: "Expired", listingStatus: listingStatusEnum.EXPIRED },
  ];

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
      <div className="all-pages">
        <Container fluid className="all-pages">
          <Tab.Container
            id="sidebar"
            activeKey={activeTab}
            onSelect={(key) => {
              setActiveTab(key as string);
              setIsEditing(key === "addListing");
            }}
          >
            <Row>
              <Col sm={12} lg={2}>
                <Nav variant="pills" className="flex-column">
                  <Nav.Item>
                    <Nav.Link eventKey="summary" className="tab">
                      Summary
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="viewListings" className="tab">
                      Current Listings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="addListing" className="tab">
                      + Add Listing
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={12} lg={8}>
                <Tab.Content>
                  <Tab.Pane eventKey="summary">
                    <Container fluid>
                      <Row>
                        <Col xs={12} sm={6} lg={4} className="pb-4">
                          <Table responsive bordered hover className="mt-0">
                            <thead>
                              <tr>
                                <th>Status</th>
                                <th>Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              {summaryTableRows.map((tableRow) => (
                                <tr key={tableRow.listingStatus}>
                                  <td>{tableRow.label}</td>
                                  <td>
                                    {isLoading
                                      ? "--"
                                      : getCount(tableRow.listingStatus)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>

                  <Tab.Pane eventKey="viewListings">
                    <Container fluid>
                      <Row>
                        <Col>
                          {isLoading && (
                            <Spinner animation="border" variant="secondary" />
                          )}
                          {!isLoading && repsListings.length === 0 && (
                            <p>Empty for now!</p>
                          )}
                          {!isLoading &&
                            repsListings.length > 0 &&
                            repsListings
                              .sort(
                                (a, b) =>
                                  new Date(b.dateUpdated?.toDate()).getTime() -
                                  new Date(a.dateUpdated?.toDate()).getTime()
                              )
                              .map((listing) => (
                                <Col className="pb-2" key={listing.listingID}>
                                  <ListingCard
                                    listing={listing}
                                    isEditing={isEditing}
                                    setIsEditing={setIsEditing}
                                  />
                                </Col>
                              ))}
                        </Col>
                      </Row>
                    </Container>
                  </Tab.Pane>

                  <Tab.Pane eventKey="addListing">
                    <AddListingWrapper
                      allBuildings={allBuildings}
                      isEditing={isEditing}
                      setIsEditing={setIsEditing}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </div>
    </Profiler>
  );
};

export default withRouter(ManageListingsPage);
