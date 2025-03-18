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
import { useState } from "react";
import AreYouSureModal from "./AreYouSureModal";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "buildingName" | "listingID" | "expiryDate"
>;

type ListingActionsButtonsPropsType = {
  isExistingListing: boolean;
  toggleFormCallback: (editListingID: string, clickedSave: boolean) => void;
  listing: ListingWithRequired;
  editListingID: string;
  onEditClick: () => void;
};

const ListingActionsButtons: React.FC<ListingActionsButtonsPropsType> = ({
  listing,
  editListingID,
  toggleFormCallback,
  onEditClick,
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

  return (
    <>
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
            Edit / Renew
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
      {editListingID === listing.listingID && (
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
