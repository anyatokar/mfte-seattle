import { Profiler, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
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
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import AreYouSureModal from "../components/AreYouSureModal";

const ManageListingsPage: React.FC<IPage> = () => {
  const { currentUser, accountType } = useAuth();

  const [repsListings, isLoadingRepsListings] = useAllListings(
    false,
    currentUser?.uid
  );
  const defaultActiveKey: string = "viewListings";
  const [activeTab, setActiveTab] = useState<string>(defaultActiveKey);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
  const [editListingID, setEditListingID] = useState<string>("");
  const [modalListingID, setModalListingID] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = (listingID: string) => {
    setModalListingID(listingID); // Set the listingID when showing the modal
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (modalListingID === editListingID) {
      console.log("modalListingID === editListingID");
      setIsFormVisible(false);
      setEditListingID("");
    } else if (modalListingID !== "" && modalListingID !== editListingID) {
      console.log("Switching listings");
      setEditListingID(modalListingID);
      setIsFormVisible(true);
    } else if (modalListingID === "") {
      setEditListingID("");
    }

    handleClose();
  };

  function toggleFormCallback(listingID: string, clickedSave: boolean) {
    if (clickedSave) {
      setIsFormVisible(false);
      setEditListingID("");
    } else if (isFormVisible && listingID !== editListingID) {
      handleShow(listingID);
    } else if (isFormVisible) {
      handleShow(listingID);
    } else {
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
      id={"ManageListings"}
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
            <div className="display-6 mb-5">Manage Listings</div>
          </Col>
        </Row>

        <>
          <Tab.Container
            id="sidebar"
            activeKey={activeTab}
            onSelect={(key) => {
              setActiveTab(key as string);
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
                      {/* TODO: Pull out into a new component to reuse with archived */}
                      <Row className="pb-2">
                        <Col>
                          <ListingCard
                            listing={null}
                            toggleFormCallback={toggleFormCallback}
                            isFormVisible={isFormVisible}
                            isExistingListing={false}
                            editListingID={editListingID}
                          />
                        </Col>
                      </Row>

                      {isLoadingRepsListings && (
                        <Spinner animation="border" variant="secondary" />
                      )}

                      {!isLoadingRepsListings &&
                        repsListings.filter(
                          (listing) =>
                            listing.listingStatus !== listingStatusEnum.ARCHIVED
                        ).length === 0 && <p>No current listings.</p>}
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
                    </Container>
                  </Tab.Pane>

                  <Tab.Pane eventKey="addListing">
                    <ListingCard
                      isFormVisible={isFormVisible}
                      listing={null}
                      toggleFormCallback={toggleFormCallback}
                      isExistingListing={false}
                      editListingID={editListingID}
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
        </>
      </Container>
      <AreYouSureModal
        showModal={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.LISTING_CANCEL_EDIT}
      />
    </Profiler>
  );
};

export default ManageListingsPage;
