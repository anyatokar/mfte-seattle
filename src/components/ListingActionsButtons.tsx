import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AreYouSureModal from "./AreYouSureModal";
import { confirmModalTypeEnum, listingStatusEnum } from "../types/enumTypes";
import IListing from "../interfaces/IListing";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { PartialWithRequired } from "../types/partialWithRequiredType";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "buildingName" | "listingID" | "expiryDate"
>;

type ListingActionsButtonsPropsType = {
  listing: ListingWithRequired;
  onEditClick: (listingID: string) => void;
};

const ListingActionsButtons: React.FC<ListingActionsButtonsPropsType> = ({
  listing,
  onEditClick,
}) => {
  // TODO: maybe don't use buildingName off of listing? In general figure out how to store other building name.
  const { listingID, buildingName, expiryDate, listingStatus } = listing;
  const [showModal, setShowModal] = useState(false);
  const { currentUser } = useAuth();

  if (!currentUser) return;

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleConfirm = () => {
    deleteListingFirestore(listingID, buildingName);

    handleClose();
  };

  const onArchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateListingFirestore(
      {
        listingStatus: listingStatusEnum.ARCHIVED,
        expiryDate: expiryDate,
      },
      listingID
    );
  };

  const onUnarchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    updateListingFirestore(
      {
        listingStatus: listingStatusEnum.IN_REVIEW,
        expiryDate: expiryDate,
      },
      listingID
    );
  };

  const onDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    handleShow();
  };

  return (
    <>
      <DropdownButton
        id="actions-dropdown-button"
        title="Actions"
        as={ButtonGroup}
        variant="outline-primary"
      >
        {listingStatus === listingStatusEnum.ARCHIVED && (
          <Dropdown.Item eventKey="unarchive" onClick={onUnarchiveClick}>
            Move To Current
          </Dropdown.Item>
        )}

        <Dropdown.Item eventKey="edit" onClick={() => onEditClick(listingID)}>
          Edit / Renew
        </Dropdown.Item>

        <Dropdown.Divider />
        {listingStatus !== listingStatusEnum.ARCHIVED && (
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

      <AreYouSureModal
        showModal={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.LISTING_DELETE}
      />
    </>
  );
};

export default ListingActionsButtons;
