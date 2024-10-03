import Card from "react-bootstrap/esm/Card";
import IListing from "../interfaces/IListing";
import Badge from "react-bootstrap/esm/Badge";
import BuildingDataTable from "./BuildingDataTable";
import { listingStatusEnum, tableType } from "../types/enumTypes";
import { deleteListing, updateListing } from "../utils/firestoreUtils";

import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import Container from "react-bootstrap/esm/Container";
import Stack from "react-bootstrap/esm/Stack";
import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

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
  return (
    <DropdownButton
      id="actions-dropdown-button"
      title="Actions"
      as={ButtonGroup}
      variant="outline-primary"
    >
      <Dropdown.Item eventKey="edit">Edit</Dropdown.Item>
      <Dropdown.Item
        eventKey="renew"
        // onClick={() => {
        //   updateListing(listingID, buildingName, fieldsToUpdate);
        // }}
      >
        Renew
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="archive"
        onClick={() => {
          updateListing(listingID, buildingName, {
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
          deleteListing(listingID, buildingName);
        }}
      >
        Delete
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ListingActionsButtons;
