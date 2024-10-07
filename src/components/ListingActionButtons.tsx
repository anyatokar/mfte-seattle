import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { Timestamp } from "firebase/firestore";
import { listingMaxDays } from "../config/config";
import { useAuth } from "../contexts/AuthContext";

import IListing from "../interfaces/IListing";

import { listingStatusEnum } from "../types/enumTypes";
import { PartialWithRequired } from "../types/partialWithRequiredType";

import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import { getMaxExpiryDate } from "../utils/generalUtils";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "buildingName" | "listingID"
>;

type ListingActionsButtonsPropsType = {
  listing: ListingWithRequired;
  isEditing: boolean;
  setEditingListingID: React.Dispatch<React.SetStateAction<string | null>>;
};

const ListingActionsButtons: React.FC<ListingActionsButtonsPropsType> = ({
  listing,
  isEditing,
  setEditingListingID,
}) => {
  const { currentUser } = useAuth();

  if (!currentUser) return;

  const { buildingName, listingID } = listing;

  const onRenewClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    updateListingFirestore(
      { expiryDate: getMaxExpiryDate()},
      listingID
    );
  };

  const onArchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    updateListingFirestore(
      { listingStatus: listingStatusEnum.ARCHIVED },
      listingID
    );
  };

  const onDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    deleteListingFirestore(listingID, buildingName, currentUser.uid);
  };

  return (
    <>
      {!isEditing && (
        <DropdownButton
          id="actions-dropdown-button"
          title="Actions"
          as={ButtonGroup}
          variant="outline-primary"
        >
          <Dropdown.Item
            eventKey="edit"
            onClick={() => setEditingListingID(listingID)}
          >
            Edit
          </Dropdown.Item>

          <Dropdown.Item eventKey="renew" onClick={onRenewClick}>
            Renew
          </Dropdown.Item>

          <Dropdown.Item eventKey="archive" onClick={onArchiveClick}>
            Archive
          </Dropdown.Item>

          <Dropdown.Divider />
          <Dropdown.Item
            className="delete-link"
            eventKey="delete"
            onClick={onDeleteClick}
          >
            Delete
          </Dropdown.Item>
        </DropdownButton>
      )}
      {isEditing && (
        <Button
          variant="outline-danger"
          onClick={() => setEditingListingID(null)}
        >
          Cancel Edit
        </Button>
      )}
    </>
  );
};

export default ListingActionsButtons;
