import {
  deleteListingFirestore,
  updateListingFirestore,
} from "../utils/firestoreUtils";
import IListing from "../interfaces/IListing";

import { listingStatusEnum } from "../types/enumTypes";
import { PartialWithRequired } from "../types/partialWithRequiredType";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { Timestamp } from "firebase/firestore";
import { listingDaysToExpiration } from "../config/config";

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
  function onEditClick() {}

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

      <Dropdown.Item
        eventKey="renew"
        onClick={() => {
          updateListingFirestore({
            listingID,
            buildingName,
            expiryDate: Timestamp.fromDate(
              new Date(
                Date.now() + listingDaysToExpiration * 24 * 60 * 60 * 1000
              )
            ),
          });
        }}
      >
        Renew
      </Dropdown.Item>

      <Dropdown.Item
        eventKey="archive"
        onClick={() => {
          updateListingFirestore({
            listingID,
            buildingName,
            listingStatus: listingStatusEnum.ARCHIVED,
          });
        }}
      >
        Archive
      </Dropdown.Item>

      <Dropdown.Divider />
      <Dropdown.Item
        className="delete-link"
        eventKey="delete"
        onClick={() => {
          deleteListingFirestore(listingID, buildingName);
        }}
      >
        Delete
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ListingActionsButtons;
