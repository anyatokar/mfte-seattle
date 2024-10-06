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
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddListingForm: React.FunctionComponent<AddListingWrapperProps> = ({
  allBuildings,
  isEditing,
  setIsEditing,
}) => {
  const emptyListing = {
    availData: [], // make sure it's a valid array for availDataType
    url: "",
    expiryDate: null,
    listingID: "",
    buildingID: "",
  };

  return (
    <Container fluid>
      <Row className="justify-content-center">
        <Col>
          {isEditing ? (
            <>
              <p>Please submit one form per building.</p>
              <p>Fields marked with * are required.</p>

              <EditListingForm
                allBuildings={allBuildings}
                listing={emptyListing}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
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
                onClick={() => setIsEditing(true)}
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
