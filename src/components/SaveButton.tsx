import { Button } from "react-bootstrap";

interface SaveButtonProps {
  isSaved: boolean;
  onClickCallback: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  isSaved,
  onClickCallback,
}): JSX.Element => {
  return (
    <Button
      variant={isSaved ? "dark" : "outline-dark"}
      size="sm"
      id="save-button"
      onClick={onClickCallback}
    >
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
};

export default SaveButton;
