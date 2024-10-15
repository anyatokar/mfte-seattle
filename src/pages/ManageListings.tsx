import { Profiler, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { expiringSoonDays, isProfilerOn } from "../config/config";
import {
  accountTypeEnum,
  confirmModalTypeEnum,
  expiryBadgeEnum,
  listingStatusEnum,
} from "../types/enumTypes";
import { useAllListings } from "../hooks/useListings";

import ListingCard from "../components/ListingCard";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/esm/Spinner";
import Tab from "react-bootstrap/esm/Tab";
import Nav from "react-bootstrap/esm/Nav";

import AreYouSureModal from "../components/AreYouSureModal";
import IBuilding from "../interfaces/IBuilding";

const ManageListingsPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = ({ name }) => {
  const { currentUser, accountType } = useAuth();

  // TODO: Is use all listings being called too much?
  const [repsListings, isLoadingRepsListings] = useAllListings(
    currentUser?.uid
  );
  const defaultActiveKey: string = "viewListings";
  const [activeTab, setActiveTab] = useState<string>(defaultActiveKey);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>(
    null
  );

  // Use a state to track which listingID is currently being edited
  const [editListingID, setEditListingID] = useState<string>("");

  const [showModal, setShowModal] = useState(false);
  const [newListingID, setNewListingID] = useState<string>("");

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleConfirm = () => {
    if (newListingID !== editListingID) {
      console.log(newListingID !== "" || "newListingID !== editListingID");
      setEditListingID(newListingID);
      setIsFormVisible(true);
    } else {
      console.log("newListingID === editListingID");
      setIsFormVisible(false);
      setEditListingID("");
      setSelectedBuilding(null);
    }

    handleClose();
  };
  // newlistingID !== "" means its an edit of an existing listing, if the form is visible
  function toggleFormCallback(listingID: string, clickedSave: boolean) {
    if (clickedSave) {
      console.log("Clicked save");
      setIsFormVisible(false);
      setNewListingID("");
      setEditListingID("");
      setSelectedBuilding(null);
      // A switch from Edit to another Edit
    } else if (isFormVisible && listingID !== editListingID) {
      console.log("A switch from Edit to another Edit");
      setNewListingID(listingID);
      handleShow();
      // From open to closed
    } else if (isFormVisible) {
      console.log("From open to closed");
      handleShow();
    } else {
      // From closed to open
      console.log("From closed to open");
      setIsFormVisible(true);
      setEditListingID(listingID);
    }
  }

  if (!currentUser || accountType !== accountTypeEnum.MANAGER) {
    return null;
  }

  function getCount(label: listingStatusEnum | expiryBadgeEnum): number {
    const currentDate = new Date();

    return repsListings.filter((listing) => {
      const expiryDateAsDate = new Date(listing.expiryDate);

      if (label === expiryBadgeEnum.EXPIRED) {
        return expiryDateAsDate < currentDate;
      }

      if (label === expiryBadgeEnum.EXPIRING_SOON) {
        return (
          expiryDateAsDate.getTime() - expiringSoonDays * 24 * 60 * 60 * 1000 <
            currentDate.getTime() && expiryDateAsDate >= currentDate
        );
      }
      return listing.listingStatus === label;
    }).length;
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
    { label: "Expiring Soon", listingStatus: expiryBadgeEnum.EXPIRING_SOON },
    { label: "Expired", listingStatus: expiryBadgeEnum.EXPIRED },
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
      <Container fluid className="all-pages">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="display-5">Manage Listings</div>
            <hr className="my-4 break-line-light" />
          </Col>
        </Row>
      </Container>

      <Container fluid>
        <Tab.Container
          id="sidebar"
          activeKey={activeTab}
          onSelect={(key) => {
            setActiveTab(key as string);
            setEditListingID(""); // Reset editing state when changing tabs
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
                    Current
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="archived" className="tab">
                    Archived
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
                                  {isLoadingRepsListings
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
                        {/* TODO: Pull out into a new component to reuse with archived */}
                        <Row className="pb-3">
                          <Col>
                            <ListingCard
                              listing={null}
                              toggleFormCallback={toggleFormCallback}
                              isFormVisible={isFormVisible}
                              isExistingListing={false}
                              editListingID={editListingID}
                              setSelectedBuilding={setSelectedBuilding}
                              selectedBuilding={selectedBuilding}
                            />
                          </Col>
                        </Row>

                        {isLoadingRepsListings && (
                          <Spinner animation="border" variant="secondary" />
                        )}

                        {!isLoadingRepsListings &&
                          repsListings.filter(
                            (listing) =>
                              listing.listingStatus !==
                              listingStatusEnum.ARCHIVED
                          ).length === 0 && <p>Empty for now!</p>}
                        {!isLoadingRepsListings &&
                          repsListings.length > 0 &&
                          repsListings
                            .filter(
                              (listing) =>
                                listing.listingStatus !==
                                listingStatusEnum.ARCHIVED
                            )
                            .sort(
                              (a, b) =>
                                new Date(b.dateUpdated?.toDate()).getTime() -
                                new Date(a.dateUpdated?.toDate()).getTime()
                            )
                            .map((listing) => (
                              <Col className="pb-2" key={listing.listingID}>
                                <ListingCard
                                  listing={listing}
                                  toggleFormCallback={toggleFormCallback}
                                  isFormVisible={isFormVisible}
                                  isExistingListing={true}
                                  editListingID={editListingID}
                                />
                              </Col>
                            ))}
                      </Col>
                    </Row>
                  </Container>
                </Tab.Pane>

                <Tab.Pane eventKey="addListing">
                  <ListingCard
                    isFormVisible={isFormVisible}
                    listing={null}
                    toggleFormCallback={toggleFormCallback}
                    isExistingListing={false}
                    editListingID={editListingID}
                    selectedBuilding={selectedBuilding}
                  />
                </Tab.Pane>

                <Tab.Pane eventKey="archived">
                  <Container fluid>
                    <Row>
                      <Col>
                        {isLoadingRepsListings && (
                          <Spinner animation="border" variant="secondary" />
                        )}
                        {!isLoadingRepsListings &&
                          repsListings.filter(
                            (listing) =>
                              listing.listingStatus ===
                              listingStatusEnum.ARCHIVED
                          ).length === 0 && <p>Archived list is empty.</p>}
                        {!isLoadingRepsListings &&
                          repsListings.length > 0 &&
                          repsListings
                            .filter(
                              (listing) =>
                                listing.listingStatus ===
                                listingStatusEnum.ARCHIVED
                            )
                            .sort(
                              (a, b) =>
                                new Date(b.dateUpdated?.toDate()).getTime() -
                                new Date(a.dateUpdated?.toDate()).getTime()
                            )
                            .map((listing) => (
                              <Col className="pb-2" key={listing.listingID}>
                                <ListingCard
                                  listing={listing}
                                  // showListingForm={
                                  //   editListingID === listing.listingID
                                  // }
                                  isFormVisible={isFormVisible}
                                  editListingID={editListingID}
                                  toggleFormCallback={toggleFormCallback}
                                  isExistingListing={true}
                                />
                              </Col>
                            ))}
                      </Col>
                    </Row>
                  </Container>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
      <AreYouSureModal
        showModal={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.CANCEL}
      />
    </Profiler>
  );
};

export default withRouter(ManageListingsPage);
