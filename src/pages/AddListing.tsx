import { Profiler } from "react";
import { isProfilerOn } from "../config/constants";
import ListingAccordion from "../components/ListingAccordion";

import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const AddListingPage: React.FC<IPage> = () => {
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
            <div className="display-6 mb-5">For Property Owners & Managers</div>
            <p className="lead">
              Add listings for currently available rent-reduced apartments in
              your building to reach this website's 3.5K monthly active users.
            </p>
            <ListingAccordion />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AddListingPage;
