import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import { Timestamp } from "firebase/firestore";
import { listingMaxDays } from "../config/config";

import IListing from "../interfaces/IListing";

import { listingStatusEnum } from "../types/enumTypes";
import { PartialWithRequired } from "../types/partialWithRequiredType";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

type ListingWithRequired = PartialWithRequired<
  IListing,
  "availData" | "buildingName" | "listingStatus" | "url" | "listingID"
>;

const ListingActionsButtons: React.FC<ListingWithRequired> = ({
  availData,
  buildingName,
  listingStatus,
  url,
  listingID,
}) => {
  const onEditClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    console.log("Edit clicked");
  };

  const onRenewClick = (event: any) => {
    event.preventDefault();

    const newExpiryDate = Timestamp.fromDate(
      new Date(Date.now() + listingMaxDays * 24 * 60 * 60 * 1000)
    );

    updateListingFirestore({
      listingID,
      buildingName,
      expiryDate: newExpiryDate,
    });
  };

  const onArchiveClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    updateListingFirestore({
      listingID,
      buildingName,
      listingStatus: listingStatusEnum.ARCHIVED,
    });
  };

  const onDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    deleteListingFirestore(listingID, buildingName);
  };

  return (
    <DropdownButton
      id="actions-dropdown-button"
      title="Actions"
      as={ButtonGroup}
      variant="outline-primary"
    >
      <Dropdown.Item eventKey="edit" onClick={onEditClick}>
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
  );
};

export default ListingActionsButtons;
