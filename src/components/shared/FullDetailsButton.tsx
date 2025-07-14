import { Button, Modal } from "react-bootstrap";
import { MutableRefObject, useState } from "react";
import BuildingCard from "../all-buildings/BuildingCard";
import IBuilding from "../../interfaces/IBuilding";
import { UnitAvailData } from "../../interfaces/IListing";
import ISavedBuilding from "../../interfaces/ISavedBuilding";

interface FullDetailsButtonProps {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
}
const FullDetailsButton: React.FC<FullDetailsButtonProps> = ({
  building,
  savedHomeData,
  shouldScroll,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<UnitAvailData | null>(null);

  console.log("modalContent", modalContent);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    // Button only visible on small screens
    <div className="d-block d-md-none">
      <Button
        size="sm"
        id="full-details"
        variant="outline-dark"
        onClick={handleShowModal}
      >
        Details
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>
          <BuildingCard
            building={building}
            savedHomeData={savedHomeData}
            shouldScroll={shouldScroll}
            setModalContent={setModalContent}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FullDetailsButton;
