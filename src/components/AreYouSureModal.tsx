import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { confirmModalTypeEnum } from "../types/enumTypes";

type AreYouSureModalProps = {
  showModal: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  confirmType: confirmModalTypeEnum;
};
const AreYouSureModal: React.FunctionComponent<AreYouSureModalProps> = ({
  showModal,
  handleClose,
  handleConfirm,
  confirmType,
}) => {
  function getHeader() {
    if (confirmType === confirmModalTypeEnum.CANCEL) {
      return "Confirm Cancel";
    } else if (confirmType === confirmModalTypeEnum.DELETE) {
      return "Confirm Delete";
    }
  }

  function getText() {
    if (confirmType === confirmModalTypeEnum.CANCEL) {
      return "Are you sure you want to cancel any unsaved changes?";
    } else if (confirmType === confirmModalTypeEnum.DELETE) {
      return "Are you sure you want to delete this listing? This can't be undone. You may choose to archive it instead.";
    }
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{getHeader()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getText()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Go Back
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AreYouSureModal;
