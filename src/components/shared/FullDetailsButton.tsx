import { MutableRefObject, useState } from "react";
import IncomeLimitsModal from "./IncomeLimitsModal";
import BuildingCard from "../all-buildings/BuildingCard";
import { TableTypeEnum } from "../../types/enumTypes";
import IBuilding from "../../interfaces/IBuilding";
import { UnitAvailData } from "../../interfaces/IListing";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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

  const handleClose = () => {
    setShowModal(false);
    setModalContent(null);
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
        {!modalContent ? (
          <>
            <Modal.Header closeButton></Modal.Header>
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
          </>
        ) : (
          <>
            <IncomeLimitsModal
              type={TableTypeEnum.availData}
              unitAvailData={modalContent}
            />

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setModalContent(null)}>
                Back
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default FullDetailsButton;
