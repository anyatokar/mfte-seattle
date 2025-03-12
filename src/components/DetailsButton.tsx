import { MutableRefObject, useState } from "react";
import IBuilding from "../interfaces/IBuilding";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import BuildingCard from "./BuildingCard";
import ISavedBuilding from "../interfaces/ISavedBuilding";

interface DetailsButtonProps {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
}

const DetailsButton: React.FC<DetailsButtonProps> = ({
  building,
  savedHomeData,
  shouldScroll,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        size="sm"
        id="building-details"
        variant="outline-dark"
        onClick={() => setShowModal(true)}
      >
        Details
      </Button>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton />
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

export default DetailsButton;
