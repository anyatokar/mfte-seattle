import { Profiler } from "react";
import { isProfilerOn } from "../config/config";
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
              Looking to reach more prospective tenants for rent-reduced units?
            </p>
            <p>
              List currently or soon-to-be available MFTE, IZ, MHA and MPC units
              to reach this website's 3,000 monthly active users.
            </p>
            <ListingAccordion />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default AddListingPage;
