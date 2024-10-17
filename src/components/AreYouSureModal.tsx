import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import { confirmModalTypeEnum } from "../types/enumTypes";
import { useEffect, useState } from "react";

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
  type ModalText = {
    header: string;
    body: string;
  };

  const modalTextLookup: { [key in confirmModalTypeEnum]: ModalText } = {
    [confirmModalTypeEnum.LISTING_CANCEL_EDIT]: {
      header: "Confirm Cancel",
      body: "Are you sure you want to cancel any unsaved changes?",
    },
    [confirmModalTypeEnum.LISTING_DELETE]: {
      header: "Confirm Delete",
      body: "Are you sure you want to delete this listing? This can't be undone. You may choose to archive it instead.",
    },
    [confirmModalTypeEnum.ACCOUNT_DELETE]: {
      header: "Confirm Delete Account",
      body: "Are you sure you want to delete your account? This can't be undone.",
    },
  };

  const [modalText, setModalText] = useState<ModalText | null>(null);

  useEffect(() => {
    setModalText(modalTextLookup[confirmType]);
  }, []);

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalText?.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalText?.body}</Modal.Body>
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
