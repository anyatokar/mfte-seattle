import { Button } from "react-bootstrap";
import IBuilding from "../../interfaces/IBuilding";
import { willShowAvailTable } from "../../utils/generalUtils";

type WebsiteButtonProps = {
  building: IBuilding;
};
const WebsiteButton: React.FC<WebsiteButtonProps> = ({
  building,
}): JSX.Element => {
  const hasListing = willShowAvailTable(building.listing);

  const websiteUrl = hasListing
    ? building.listing.url
    : building.contact.urlForBuilding;

  return (
    <Button
      variant="outline-dark"
      size="sm"
      id="building-url"
      target="_blank"
      rel="noreferrer"
      href={websiteUrl}
      title={`Open new tab: ${websiteUrl}`}
    >
      Website
    </Button>
  );
};

export default WebsiteButton;
