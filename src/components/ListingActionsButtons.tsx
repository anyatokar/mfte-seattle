import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { useAuth } from "../contexts/AuthContext";

import IListing from "../interfaces/IListing";

import { confirmModalTypeEnum, listingStatusEnum } from "../types/enumTypes";
import { PartialWithRequired } from "../types/partialWithRequiredType";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { getMaxExpiryDate } from "../utils/generalUtils";
import { useState } from "react";
import AreYouSureModal from "./AreYouSureModal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "buildingName" | "listingID" | "expiryDate"
>;

type ListingActionsButtonsPropsType = {
  isFormVisible: boolean;
  isExistingListing: boolean;
  toggleFormCallback: (editListingID: string, clickedSave: boolean) => void;
  listing: ListingWithRequired;
  editListingID: string;
};

const ListingActionsButtons: React.FC<ListingActionsButtonsPropsType> = ({
  listing,
  editListingID,
  isFormVisible,
  isExistingListing,
  toggleFormCallback,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();

  if (!currentUser) return;

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleConfirm = () => {
    deleteListingFirestore(listing.listingID, listing.buildingName);

    handleClose();
  };

  const onCancelClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    toggleFormCallback(listing.listingID, false);
  };

  const onRenewClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateListingFirestore(
      { expiryDate: getMaxExpiryDate() },
      listing.listingID
    );
  };

  const onArchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateListingFirestore(
      {
        listingStatus: listingStatusEnum.ARCHIVED,
        expiryDate: listing.expiryDate,
      },
      listing.listingID
    );
  };

  const onUnarchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateListingFirestore(
      {
        listingStatus: listingStatusEnum.IN_REVIEW,
        expiryDate: listing.expiryDate,
      },
      listing.listingID
    );
  };

  const onDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    handleShow();
  };

  const onAddClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    toggleFormCallback("", false);
  };

  const onEditClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    toggleFormCallback(listing.listingID, false);
  };

  return (
    <>
      {/* Show Add Listing only on New Listing Card and if either
      no form is visible (meaning any form) 
      OR a form is visible and it's listing ID is blank */}
      {!isExistingListing &&
        (!isFormVisible || (isFormVisible && editListingID !== "")) && (
          <Row>
            <Col>
              <Button variant="success" onClick={onAddClick}>
                Add Building
              </Button>
            </Col>
          </Row>
        )}
      {/* It's an existing listing & this listing is not getting edited */}
      {listing.listingID !== "" && listing.listingID !== editListingID && (
        <DropdownButton
          id="actions-dropdown-button"
          title="Actions"
          as={ButtonGroup}
          variant="outline-primary"
        >
          {listing.listingStatus === listingStatusEnum.ARCHIVED && (
            <Dropdown.Item eventKey="unarchive" onClick={onUnarchiveClick}>
              Move To Current
            </Dropdown.Item>
          )}

          <Dropdown.Item eventKey="edit" onClick={onEditClick}>
            Edit
          </Dropdown.Item>

          <Dropdown.Item eventKey="renew" onClick={onRenewClick}>
            Renew
          </Dropdown.Item>

          <Dropdown.Divider />
          {listing.listingStatus !== listingStatusEnum.ARCHIVED && (
            <Dropdown.Item eventKey="archive" onClick={onArchiveClick}>
              Archive
            </Dropdown.Item>
          )}

          <Dropdown.Item
            data-testid="dropdown-delete"
            className="delete-link"
            eventKey="delete"
            onClick={onDeleteClick}
          >
            Delete
          </Dropdown.Item>
        </DropdownButton>
      )}
      {isFormVisible && editListingID === listing.listingID && (
        <Button variant="outline-danger" onClick={onCancelClick}>
          Cancel
        </Button>
      )}

      <AreYouSureModal
        showModal={showModal}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.LISTING_DELETE}
      />
    </>
  );
};

export default ListingActionsButtons;
