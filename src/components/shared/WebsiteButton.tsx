import { Button } from "react-bootstrap";
import IBuilding from "../../interfaces/IBuilding";
import { willShowAvailTable } from "../../utils/generalUtils";

interface WebsiteButtonProps {
  building: IBuilding;
}
const WebsiteButton: React.FC<WebsiteButtonProps> = ({ building }) => {
  const hasListing = willShowAvailTable(building.listing);

  const websiteUrl = hasListing
    ? building.listing.url
    : building.contact.urlForBuilding;

  return (
    <Button
      size="sm"
      id="building-url"
      target="_blank"
      rel="noreferrer"
      variant="primary"
      href={websiteUrl}
      title={`Open new tab: ${websiteUrl}`}
    >
      Website
    </Button>
  );
};

export default WebsiteButton;
