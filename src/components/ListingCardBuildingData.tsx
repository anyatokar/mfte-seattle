import { useAllBuildingsContext } from "../contexts/AllBuildingsContext";
import { TableParentEnum, TableTypeEnum } from "../types/enumTypes";
import { AddressAndPhone } from "./AddressAndPhone";
import BuildingDataTable from "./BuildingDataTable";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { findSelectedBuilding } from "./EditListingForm";

type ListingCardBuildingDataProps = {
  buildingID: string;
};

const ListingCardBuildingData: React.FC<ListingCardBuildingDataProps> = ({
  buildingID,
}) => {
  const [allBuildings] = useAllBuildingsContext();

  const building = findSelectedBuilding(buildingID, allBuildings);

  if (!building) {
    return;
  }

  const { contact, address, buildingName } = building;

  return (
    buildingID && (
      <>
        <Card.Text className="mb-0">
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
