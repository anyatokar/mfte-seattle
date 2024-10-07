import { useState } from "react";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import EditListingForm from "./EditListingForm";
import IBuilding from "../interfaces/IBuilding";

type AddListingWrapperProps = {
  allBuildings: IBuilding[];
  isEditing: boolean;
  setEditingListingID: React.Dispatch<React.SetStateAction<string | null>>;
};

const AddListingForm: React.FunctionComponent<AddListingWrapperProps> = ({
  allBuildings,
  isEditing,
  setEditingListingID,
}) => {
  const emptyListing = {
    availData: [],
    url: "",
    expiryDate: "",
    listingID: "",
    buildingID: "",
  };

  const [wasNewListingSubmitted, setWasNewListingSubmitted] =
    useState<boolean>(false);

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col>
          {isEditing && !wasNewListingSubmitted ? (
            <>
              <p>Please submit one form per building.</p>
              <p>Fields marked with * are required.</p>

              <EditListingForm
                allBuildings={allBuildings}
                listing={emptyListing}
                setEditingListingID={setEditingListingID}
                setWasNewListingSubmitted={setWasNewListingSubmitted}
              />
            </>
          ) : (
            <>
              <p>
                Thank you for your submission! It is now in review. You can view
                it in the Current Listings tab.
              </p>
              <Button
                className="diy-solid-info-button"
                onClick={() => setWasNewListingSubmitted(false)}
              >
                Add Another Building
              </Button>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AddListingForm;
