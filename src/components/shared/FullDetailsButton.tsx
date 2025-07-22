import { MutableRefObject, useState } from "react";
import { useUnitAvailData } from "../../contexts/UnitAvailDataContext";
import IncomeLimitsModal from "./IncomeLimitsModal";
import BuildingCard from "../all-buildings/BuildingCard";
import { BuildingCardEnum, TableTypeEnum } from "../../types/enumTypes";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type FullDetailsButtonProps = {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
};

const FullDetailsButton: React.FC<FullDetailsButtonProps> = ({
  building,
  savedHomeData,
  shouldScroll,
}): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const { unitAvailDataContext, setUnitAvailDataContext } = useUnitAvailData();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setUnitAvailDataContext(null);
    setShowModal(true);
  };

  return (
    <>
      <Button
        variant="primary"
        size="sm"
        id="full-details"
        onClick={handleShowModal}
      >
        Info
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        {!unitAvailDataContext ? (
          <>
            <Modal.Header closeButton />
            <Modal.Body>
              <BuildingCard
                building={building}
                savedHomeData={savedHomeData}
                shouldScroll={shouldScroll}
                parentComponent={BuildingCardEnum.MODAL}
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
            <IncomeLimitsModal type={TableTypeEnum.availData} />
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setUnitAvailDataContext(null)}
              >
                Back
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default FullDetailsButton;
