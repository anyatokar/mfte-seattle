import { Button, Modal } from "react-bootstrap";
import IBuilding from "../../interfaces/IBuilding";
import { MutableRefObject, useState } from "react";
import BuildingCard from "../all-buildings/BuildingCard";
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

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button
        size="sm"
        id="full-details"
        variant="outline-dark"
        onClick={handleShowModal}
      >
        Full Details
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>
          <BuildingCard
            building={building}
            savedHomeData={savedHomeData}
            shouldScroll={shouldScroll}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FullDetailsButton;
