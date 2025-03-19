import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";
import IListing from "../interfaces/IListing";
import AreYouSureModal from "./AreYouSureModal";
import { useState } from "react";
import { confirmModalTypeEnum } from "../types/enumTypes";

type AddBuildingModalProps = {
  showModal: boolean;
  onClose: () => void;
  listing: IListing | null;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  showModal,
  onClose,
  listing,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const handleClose = () => setShowConfirmModal(false);
  const handleConfirm = () => {
    handleClose();
  };

  const formTitle = listing
    ? `Edit ${listing.buildingName}`
    : "Add Building Form";

  return (
    <>
      <Modal show={showModal} onHide={onClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{formTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditListingForm onClose={onClose} listing={listing} />
        </Modal.Body>
      </Modal>
      <AreYouSureModal
        showModal={showConfirmModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmType={confirmModalTypeEnum.LISTING_CANCEL_EDIT}
      />
    </>
  );
};

export default AddBuildingModal;
