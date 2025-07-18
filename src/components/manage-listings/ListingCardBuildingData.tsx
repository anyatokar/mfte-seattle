import { AddressAndPhone } from "../shared/AddressAndPhone";
import BuildingDataTable from "../shared/BuildingDataTable";
import IBuilding from "../../interfaces/IBuilding";
import { ITempBuilding } from "../../interfaces/ITempBuilding";
import { CurrentBuildingData } from "../../interfaces/ITempBuilding";
import { TableParentEnum, TableTypeEnum } from "../../types/enumTypes";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

type ListingCardBuildingDataProps = {
  building: IBuilding | ITempBuilding | CurrentBuildingData | null;
};

const ListingCardBuildingData: React.FC<ListingCardBuildingDataProps> = ({
  building,
}) => {
  if (!building?.buildingID) return null;

  const { contact, address, buildingName, isAgeRestricted, isEnding } =
    building;

  return (
    <>
      <strong>District:</strong> {address.neighborhood}
      <Card.Text className="mt-3 mb-0">
        <strong>Address and contact:</strong>
      </Card.Text>
      <AddressAndPhone
        buildingName={buildingName}
        address={address}
        contact={contact}
        parentElement={TableParentEnum.LISTING_CARD}
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
      <Row>
        <Col>
          <Card.Text className="mt-3 mb-0">
            <strong>Age-restricted community: </strong>
            {isAgeRestricted ? "Yes" : "No"}
          </Card.Text>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card.Text className="mt-3 mb-0">
            <strong>Affordability ends in 2 years or less: </strong>
            {isEnding ? "Yes" : "No"}
          </Card.Text>
        </Col>
      </Row>
    </>
  );
};

export default ListingCardBuildingData;
