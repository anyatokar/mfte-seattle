import { BuildingCard, BuildingsCardProps } from "../components/BuildingCard";

import Modal from "react-bootstrap/Modal";

// interface DetailsProps = {

// }

export default function Details() {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
      {/* <BuildingCard
                      {...building}
                      isSaved={checkIsSaved(props.savedBuildings, building)}
                      pageType={props.pageType}
                      listing={getListing(
                        props.allListings,
                        building.buildingID
                      )}
                    /> */}
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </>
  );
}
