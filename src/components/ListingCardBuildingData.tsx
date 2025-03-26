import IBuilding from "../interfaces/IBuilding";
import { TableParentEnum, TableTypeEnum } from "../types/enumTypes";
import { ITempBuilding } from "../utils/firestoreUtils";
import { AddressAndPhone } from "./AddressAndPhone";
import BuildingDataTable from "./BuildingDataTable";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type ListingCardBuildingDataProps = {
  building: IBuilding | ITempBuilding | null;
};

const ListingCardBuildingData: React.FC<ListingCardBuildingDataProps> = ({
  building,
}) => {
  if (!building) return;

  const { contact, address, buildingName, buildingID } = building;

  return (
    buildingID && (
      <>
        <strong>District:</strong> {address.neighborhood}
        <Card.Text className="mt-3 mb-0">
          <strong>Address and contact:</strong>
        </Card.Text>
        <AddressAndPhone
          buildingName={buildingName}
          address={address}
          contact={contact}
          withLinks={false}
        />
        <Card.Text className="mt-3 mb-0">
          <strong>Building URL:</strong>{" "}
          <a
            id="addressLink"
            href={contact.urlForBuilding}
            target="_blank"
            rel="noreferrer"
            className="address-phone-link"
          >
            {contact.urlForBuilding}
          </a>
        </Card.Text>
        <Card.Text className="mt-3 mb-0">
          <strong>All rent-reduced units in building:</strong>
        </Card.Text>
        <Row>
          <Col md={6}>
            <BuildingDataTable
              type={TableTypeEnum.amiData}
              data={building.amiData}
              tableParent={TableParentEnum.LISTING_CARD}
            />
          </Col>
        </Row>
      </>
    )
  );
};

export default ListingCardBuildingData;
