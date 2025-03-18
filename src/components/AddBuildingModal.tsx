import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";

type AddBuildingModalProps = {
  toggleFormCallback: (editListingID: string, isSaved: boolean) => void;
  showModal: boolean;
  handleClose: () => void;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  toggleFormCallback,
  showModal,
  handleClose,
}) => {
  return (
    <Modal show={showModal} onHide={handleClose} fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Add Building Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <EditListingForm
          isExistingListing={false}
          toggleFormCallback={toggleFormCallback}
          isFormVisible={true}
        />
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default AddBuildingModal;
