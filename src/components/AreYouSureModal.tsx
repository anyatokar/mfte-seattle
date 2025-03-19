import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { confirmModalTypeEnum } from "../types/enumTypes";

type AreYouSureModalProps = {
  showModal: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmType: confirmModalTypeEnum;
};
const AreYouSureModal: React.FC<AreYouSureModalProps> = ({
  showModal,
  onClose,
  onConfirm,
  confirmType,
}) => {
  type ModalText = {
    header: string;
    body: string;
    goBackLabel: string;
    confirmLabel: string;
  };

  const modalTextLookup: { [key in confirmModalTypeEnum]: ModalText } = {
    [confirmModalTypeEnum.LISTING_CANCEL_EDIT]: {
      header: "Confirm Cancel",
      body: "Are you sure you want to cancel any unsaved changes?",
      goBackLabel: "Go Back",
      confirmLabel: "Confirm",
    },
    [confirmModalTypeEnum.LISTING_DELETE]: {
      header: "Confirm Delete",
      body: "Are you sure you want to delete this listing? This can't be undone. You may choose to archive it instead.",
      goBackLabel: "Cancel",
      confirmLabel: "Delete",
    },
    [confirmModalTypeEnum.ACCOUNT_DELETE]: {
      header: "Confirm Delete Account",
      body: "Are you sure you want to delete your account? This can't be undone.",
      goBackLabel: "Cancel",
      confirmLabel: "Delete",
    },
  };

  const modalText = modalTextLookup[confirmType];

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalText?.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalText?.body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {modalText?.goBackLabel || "Go Back"}
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          data-testid="modal-confirm"
        >
          {modalText?.confirmLabel || "Confirm"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AreYouSureModal;
