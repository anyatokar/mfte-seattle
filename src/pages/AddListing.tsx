import { Profiler } from "react";
import { isProfilerOn } from "../config/config";
import { Timestamp } from "firebase/firestore";
import ListingAccordion from "../components/ListingAccordion";

import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export type AvailDataForm = {
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

const AddListingPage: React.FunctionComponent<IPage> = () => {
  return (
    <Profiler
      id={"AddListing"}
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
            <p className="lead">
              Looking to reach more prospective tenants for MFTE units?
            </p>
            <p>
              List your currently available or soon-to-be-available MFTE
              apartments on this website. This is an opportunity to increase
              your building's visibility to people searching for rent-reduced
              housing.
            </p>
            <ListingAccordion />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AddListingPage;
