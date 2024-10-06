import { Profiler, useState } from "react";
import { isProfilerOn } from "../config/config";
import { Timestamp } from "firebase/firestore";
import { addListingFirestore } from "../utils/firestoreUtils";
import ListingAccordion from "../components/ListingAccordion";

import IBuilding from "../interfaces/IBuilding";
import IPage from "../interfaces/IPage";
import IListing from "../interfaces/IListing";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

export type availDataFormType = {
  microNumAvail: string;
  microDateAvail: Timestamp | null;
  studioNumAvail: string;
  studioDateAvail: Timestamp | null;
  oneBedNumAvail: string;
  oneBedDateAvail: Timestamp | null;
  twoBedNumAvail: string;
  twoBedDateAvail: Timestamp | null;
  threePlusBedNumAvail: string;
  threePlusBedDateAvail: Timestamp | null;
};

const AddListingPage: React.FunctionComponent<IPage> = ({ name }) => {
  const emptyForm: Partial<IListing> = {
    buildingName: "",
    url: "",
    message: "",
  };

  function clearFields(): void {
    setFormFields(emptyForm);
    // setSelectedBuilding(null);
  }

  const [formFields, setFormFields] = useState(emptyForm);
  // const [selectedBuilding, setSelectedBuilding] = useState<IBuilding | null>();
  const [isFormVisible, setIsFormVisible] = useState(true);

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    // return addListingFirestore(formFields, selectedBuilding?.buildingID || "", uid)
    //   .then(() => {
    //     console.log("Availability data submitted successfully.");
    //     clearFields();
    //     setIsFormVisible(false);
    //   })
    //   .catch((error) => {
    //     console.error("Error sending availability data: ", error);
    //   });
  };

  const unitSizeLabels = {
    micro: "Micro/Pods",
    studio: "Studios",
    oneBed: "One Beds",
    twoBed: "Two Beds",
    threePlusBed: "Three+ Beds",
  };

  const unitSizeFields: Array<keyof typeof unitSizeLabels> = [
    "micro",
    "studio",
    "oneBed",
    "twoBed",
    "threePlusBed",
  ];

  return (
    <Profiler
      id={name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (isProfilerOn) {
          console.log({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime,
          });
        }
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-5">For Property Owners & Managers</div>
            <hr className="my-4 break-line-light" />

            <ListingAccordion />

            <hr className="my-4 break-line-light" />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AddListingPage;
