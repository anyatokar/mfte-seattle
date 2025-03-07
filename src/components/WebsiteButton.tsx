import { Button } from "react-bootstrap";
import IBuilding from "../interfaces/IBuilding";
import { listingStatusEnum } from "../types/enumTypes";

interface ListingButtonProps {
  building: IBuilding;
}
const WebsiteButton: React.FC<ListingButtonProps> = ({ building }) => {
  const hasListing =
    building.listing?.listingStatus === listingStatusEnum.ACTIVE;
  const websiteUrl = hasListing
    ? building.listing.url
    : building.contact.urlForBuilding;

  return (
    <>
      <Button
        size="sm"
        id="building-url"
        target="_blank"
        rel="noreferrer"
        variant={hasListing ? "success" : "outline-dark"}
        href={websiteUrl}
        title={`Open new tab: ${websiteUrl}`}
      >
        {hasListing ? "Listings" : "Website"}
      </Button>
    </>
  );
};

export default WebsiteButton;
