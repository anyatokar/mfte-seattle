import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";
import IListing from "../interfaces/IListing";

type AddBuildingModalProps = {
  showModal: boolean;
  onClose: (shouldConfirm: boolean) => void;
  listing: IListing | null;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  showModal,
  onClose,
  listing,
}) => {
  const formTitle = listing
    ? `Edit ${listing.buildingName}`
    : "Add Building Form";

  return (
    <>
      <Modal show={showModal} onHide={() => onClose(true)} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{formTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditListingForm onClose={() => onClose(false)} listing={listing} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBuildingModal;
