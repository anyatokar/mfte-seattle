import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";

type AddBuildingModalProps = {
  toggleFormCallback: (editListingID: string, isSaved: boolean) => void;
  showModal: boolean;
  onClose: () => void;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  toggleFormCallback,
  showModal,
  onClose,
}) => {
  return (
    <Modal show={showModal} onHide={onClose} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Add Building Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditListingForm
          toggleFormCallback={toggleFormCallback}
          onClose={onClose}
        />
      </Modal.Body>
    </Modal>
  );
};

export default AddBuildingModal;
