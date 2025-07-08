import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { expiringSoonDays } from "../../config/constants";
import {
  accountTypeEnum,
  confirmModalTypeEnum,
  expiryBadgeEnum,
  listingStatusEnum,
} from "../../types/enumTypes";
import config from "../../config/config";
import { useAllListings } from "../../hooks/useListings";
import { useAllBuildingsContext } from "../../contexts/AllBuildingsContext";
import { useTempBuildingsContext } from "../../contexts/TempBuildingsContext";

import AddBuildingModal from "../../components/manage-listings/AddBuildingModal";
import AreYouSureModal from "../../components/shared/AreYouSureModal";
import ListingCard from "../../components/manage-listings/ListingCard";
import RenderProfiler from "../../components/utility/RenderProfiler";

import IBuilding from "../../interfaces/IBuilding";
import IListing from "../../interfaces/IListing";
import IPage from "../../interfaces/IPage";
import { ITempBuilding } from "../../interfaces/ITempBuilding";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Table from "react-bootstrap/Table";

const ManageListingsPage: React.FC<IPage> = () => {
  const { currentUser, accountType } = useAuth();

  const [repsListings, isLoadingRepsListings] = useAllListings(
    false,
    currentUser?.uid
  );
  const defaultActiveKey: string = "viewListings";
  const [activeTab, setActiveTab] = useState<string>(defaultActiveKey);
  const [showAreYouSureModal, setShowAreYouSureModal] = useState(false);

  const handleAreYouSureModalClose = () => setShowAreYouSureModal(false);
  const handleConfirm = () => {
    setShowAddBuildingModal(false);
    handleAreYouSureModalClose();
  };

  const handleAddBuildingModalClose = (shouldConfirm: boolean) => {
    if (shouldConfirm) {
      setShowAreYouSureModal(true);
    } else {
      handleConfirm();
    }
  };

  const [selectedListing, setSelectedListing] = useState<IListing | null>(null);

  const [allBuildings] = useAllBuildingsContext();
  const [tempBuildings] = useTempBuildingsContext();

  function findBuilding(
    buildingID: string | undefined
  ): IBuilding | ITempBuilding | null {
    return (
      tempBuildings.find((building) => buildingID === building.buildingID) ||
      allBuildings.find((building) => buildingID === building.buildingID) ||
      null
    );
  }

  const handleEditClick = (listingID: string | null): void => {
    if (listingID === null) {
      setSelectedListing(null);
    } else {
      setSelectedListing(
        repsListings.find((listing) => listing.listingID === listingID) || null
      );
    }

    setShowAddBuildingModal(true);
  };

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

  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);

  return (
    <RenderProfiler
      id="ManageListings"
      isProfilerOn={config.debug.isProfilerOn}
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
              <Col sm={12} lg={10}>
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
                      <div className="pb-2">
                        <Button
                          variant="success"
                          onClick={() => handleEditClick(null)}
                        >
                          Add Building
                        </Button>
                      </div>

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
                                building={findBuilding(listing.buildingID)}
                                onEditClick={handleEditClick}
                              />
                            </Col>
                          ))}
                    </Container>
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
                                    building={findBuilding(listing.buildingID)}
                                    onEditClick={handleEditClick}
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
        showModal={showAreYouSureModal}
        onClose={handleAreYouSureModalClose}
        onConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.LISTING_CANCEL_EDIT}
      />
      <AddBuildingModal
        listing={selectedListing}
        building={findBuilding(selectedListing?.buildingID)}
        showModal={showAddBuildingModal}
        onClose={handleAddBuildingModalClose}
        shouldDim={showAreYouSureModal}
      />
    </RenderProfiler>
  );
};

export default ManageListingsPage;
