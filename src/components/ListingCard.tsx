import Card from "react-bootstrap/esm/Card";
import IListing from "../interfaces/IListing";

type PartialWithRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>;

type ListingWithRequired = PartialWithRequired<
  IListing,
  "availData" | "buildingName" | "isApproved" | "url"
>;

const BuildingCard: React.FC<ListingWithRequired> = ({
  availData,
  buildingName,
  isApproved,
  url,
}) => {
  return (
    <Card>
      <Card.Header>
        <Card.Title className="mt-2">{buildingName}</Card.Title>
      </Card.Header>
      <Card.Body></Card.Body>
    </Card>
  );
};

export default BuildingCard;
