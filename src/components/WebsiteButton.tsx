import { Button } from "react-bootstrap";

interface WebsiteButtonProps {
  urlForBuilding: string;
}

const WebsiteButton: React.FC<WebsiteButtonProps> = ({
  urlForBuilding,
}): JSX.Element => {
  return (
    <Button
      variant="outline-dark"
      size="sm"
      id="listing-page-url"
      href={urlForBuilding}
      title={`Open new tab: ${urlForBuilding}`}
      target="_blank"
      rel="noreferrer"
    >
      Website
    </Button>
  );
};

export default WebsiteButton;
