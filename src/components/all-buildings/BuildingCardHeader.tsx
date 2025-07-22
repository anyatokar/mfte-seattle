import { useContext, MutableRefObject } from "react";
import { deleteBuilding, saveBuilding } from "../../utils/firestoreUtils";
import { willShowAvailTable } from "../../utils/generalUtils";
import { useAuth } from "../../contexts/AuthContext";
import { ModalContext, ModalState } from "../../contexts/ModalContext";
import SaveButton from "../shared/SaveButton";
import WebsiteButton from "../shared/WebsiteButton";
import IBuilding from "../../interfaces/IBuilding";
import ISavedBuilding from "../../interfaces/ISavedBuilding";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";

export interface AllBuildingCardProps {
  building: IBuilding;
  savedHomeData: ISavedBuilding | undefined;
  shouldScroll: MutableRefObject<boolean>;
}

const BuildingCardHeader: React.FC<AllBuildingCardProps> = ({
  building,
  savedHomeData,
  shouldScroll,
}) => {
  const { buildingID, buildingName, address, listing } = building;

  const { currentUser, accountType } = useAuth();

  // All Buildings Page - save/saved button
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowLogin = () => setModalState(ModalState.LOGIN);

  function handleToggleSaveBuilding() {
    if (savedHomeData) {
      deleteBuilding(currentUser?.uid, buildingID, buildingName, accountType);
    } else {
      saveBuilding(currentUser?.uid, buildingID, buildingName, accountType);
    }
    shouldScroll.current = false;
  }

  return (
    <Card.Header>
      <Card.Title className="mt-2">
        <div>
          {buildingName}
          {willShowAvailTable(listing) && (
            <Badge pill bg="warning" text="dark" className="units-avail-badge">
              Units available!
            </Badge>
          )}
        </div>
      </Card.Title>
      <Card.Subtitle>{address.neighborhood}</Card.Subtitle>
      <div className="mt-2">
        {currentUser ? (
          savedHomeData ? (
            <Stack direction={"horizontal"} gap={2}>
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={true}
                onClickCallback={handleToggleSaveBuilding}
              />
            </Stack>
          ) : (
            <Stack direction={"horizontal"} gap={2}>
              <WebsiteButton building={building} />
              <SaveButton
                isSaved={false}
                onClickCallback={handleToggleSaveBuilding}
              />
            </Stack>
          )
        ) : (
          <Stack direction={"horizontal"} gap={2}>
            <WebsiteButton building={building} />
            <SaveButton isSaved={false} onClickCallback={handleShowLogin} />
          </Stack>
        )}
      </div>
    </Card.Header>
  );
};

export default BuildingCardHeader;
