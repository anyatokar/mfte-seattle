import Modal from "react-bootstrap/Modal";
import EditListingForm from "./EditListingForm";
import IBuilding from "../../interfaces/IBuilding";
import IListing from "../../interfaces/IListing";
import { ITempBuilding } from "../../interfaces/ITempBuilding";

type AddBuildingModalProps = {
  showModal: boolean;
  onClose: (shouldConfirm: boolean) => void;
  listing: IListing | null;
  building: IBuilding | ITempBuilding | null;
  shouldDim: boolean;
};
const AddBuildingModal: React.FC<AddBuildingModalProps> = ({
  showModal,
  onClose,
  listing,
  building,
  shouldDim,
}) => {
  const formTitle = building
    ? `Edit ${building.buildingName}`
    : "Add Building Form";

  return (
    <>
      <Modal show={showModal} onHide={() => onClose(true)} fullscreen>
        {/* Custom because edit listing is a modal and the "are you sure" is a modal on top of it */}
        <div className={shouldDim ? "dimmer-overlay" : ""}></div>
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
