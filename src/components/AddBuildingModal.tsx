import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";

type AddBuildingModalProps = {
  showModal: boolean;
  onClose: () => void;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  showModal,
  onClose,
}) => {
  return (
    <Modal show={showModal} onHide={onClose} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Add Building Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditListingForm onClose={onClose} />
      </Modal.Body>
    </Modal>
  );
};

export default AddBuildingModal;
