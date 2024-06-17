import React, { useState } from "react";
import { Table, Button, Modal, Tabs, Tab } from "react-bootstrap";
import AddPropertyModal from "./AddPropertyModal"; // Adjust the import path as needed
import IListing from "../interfaces/IListing";
import { Timestamp } from "firebase/firestore";

const ListingTable: React.FC = () => {
  const [listings, setListings] = useState<IListing[]>([
    {
      buildingID: "1",
      name: "101 Broadway",
      address: "123 Main St",
      url: "http://example.com",
      startDate: "2024-01-01",
      endDate: "2024-10-10",
      lastUpdateDate: "2024-01-01",
      listingId: "12345",
      seduAvail: { dateAvail: new Timestamp(1, 2), rent: "$1000" },
      studioAvail: { dateAvail: new Timestamp(1, 2), rent: "$1500" },
      oneBedAvail: { dateAvail: new Timestamp(1, 2), rent: "$1600" },
      twoBedAvail: { dateAvail: new Timestamp(1, 2), rent: "$1700" },
      threePlusBedAvail: { dateAvail: new Timestamp(1, 2), rent: "$1800" },
      hasAnyAvailability: true,
    },
  ]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentProperty, setCurrentProperty] =
    useState<Partial<IListing> | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [listingToDelete, setPropertyToDelete] = useState<string | null>(null);

  const handleShowModal = (listing: Partial<IListing> | null = null) => {
    setCurrentProperty(listing);
    setIsEditing(!!listing);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentProperty(null);
  };

  const handleSave = (listing: IListing) => {
    if (isEditing) {
      setListings(
        listings.map((p) => (p.listingId === listing.listingId ? listing : p))
      );
    } else {
      setListings([...listings, { ...listing, listingId: String(Date.now()) }]);
    }
    setShowModal(false);
    setCurrentProperty(null);
  };

  const handleShowDeleteModal = (listingId: string) => {
    setPropertyToDelete(listingId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const confirmDelete = () => {
    if (listingToDelete !== null) {
      setListings(listings.filter((p) => p.listingId !== listingToDelete));
      handleCloseDeleteModal();
    }
  };

  const currentListings = listings.filter(
    (listing) => new Date(listing.endDate) >= new Date()
  );
  const previousListings = listings.filter(
    (listing) => new Date(listing.endDate) < new Date()
  );

  return (
    <div>
      <Tabs defaultActiveKey="active" id="listing-tabs" className="mb-3">
        <Tab eventKey="active" title="Active">
          <Table responsive="sm" striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Listing ID</th>
                <th>Building Name</th>
                <th>Building Address</th>
                <th>Listing URL</th>
                <th>Listing Start Date</th>
                <th>Listing Update Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentListings.map((listing) => (
                <tr key={listing.listingId}>
                  <td>{listing.listingId}</td>
                  <td>{listing.name}</td>
                  <td>{listing.address}</td>
                  <td>
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {listing.url}
                    </a>
                  </td>
                  <td>{listing.startDate}</td>
                  <td>{listing.lastUpdateDate}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal(listing)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleShowDeleteModal(listing.listingId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="inactive" title="Inactive">
          <Table responsive="sm" striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Address</th>
                <th>Listing URL</th>
                <th>Listing Start Date</th>
                <th>Last Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {previousListings.map((listing) => (
                <tr key={listing.listingId}>
                  <td>{listing.name}</td>
                  <td>{listing.address}</td>
                  <td>
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {listing.url}
                    </a>
                  </td>
                  <td>{listing.startDate}</td>
                  <td>{listing.endDate}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleShowModal(listing)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleShowDeleteModal(listing.listingId)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      <Button variant="primary" onClick={() => handleShowModal()}>
        Add Listing
      </Button>

      <AddPropertyModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSave}
        isEditing={isEditing}
        property={currentProperty}
      />

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this listing?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListingTable;
