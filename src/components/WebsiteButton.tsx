import { Button } from "react-bootstrap";

interface WebsiteButtonProps {
  urlForBuilding: string;
}

const WebsiteButton: React.FC<WebsiteButtonProps> = ({
  urlForBuilding,
}): JSX.Element => {
  return (
    <Button
      className="diy-outline-info-button me-2"
      size="sm"
      id="leasing-page-url"
      href={urlForBuilding}
      title={`Open new tab: ${urlForBuilding}`}
      target="_blank"
      rel="noreferrer"
      variant="primary"
    >
      Website
    </Button>
  );
};

export default WebsiteButton;
