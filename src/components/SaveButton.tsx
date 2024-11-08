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
      className={isSaved ? "diy-solid-info-button" : "diy-outline-info-button"}
      size="sm"
      onClick={onClickCallback}
    >
      {isSaved ? "Saved" : "Save"}
    </Button>
  );
};

export default SaveButton;
