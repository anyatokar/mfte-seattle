import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";
import IListing from "../interfaces/IListing";
import { ITempBuilding } from "../utils/firestoreUtils";
import IBuilding from "../interfaces/IBuilding";

type AddBuildingModalProps = {
  showModal: boolean;
  onClose: (shouldConfirm: boolean) => void;
  listing: IListing | null;
  building: IBuilding | ITempBuilding | null;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  showModal,
  onClose,
  listing,
  building,
}) => {
  const formTitle = building
    ? `Edit ${building.buildingName}`
    : "Add Building Form";

  return (
    <>
      <Modal show={showModal} onHide={() => onClose(true)} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{formTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditListingForm
            onClose={() => onClose(false)}
            listing={listing}
            building={building}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddBuildingModal;
