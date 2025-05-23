import { Profiler } from "react";
import { isProfilerOn } from "../config/constants";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

const ResourcesPage: React.FC<IPage> = () => {
  return (
    <Profiler
      id={"Resources"}
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
            <div className="display-6 mb-5">Resources</div>

            <ListGroup variant="flush">
              <ListGroup.Item style={{ background: "none" }}>
                <div className="fw-light">
                  Seattle Office of Housing homepage with contact information
                </div>
                <a
                  id="seattle-housing-website"
                  href="https://seattle.gov/housing"
                  title="https://seattle.gov/housing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Seattle Office of Housing
                </a>

                <div className="fw-light">
                  website — Seattle Office of Housing
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <div className="fw-light">
                  Information about MFTE and other rent-reduced programs
                </div>
                <a
                  id="mfte-city-website-renters"
                  href="https://www.seattle.gov/housing/renters/find-housing"
                  title="https://www.seattle.gov/housing/renters/find-housing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Find Affordable Rental Housing Page
                </a>

                <div className="fw-light">
                  website — Seattle Office of Housing
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <a
                  id="income-and-rent-limits"
                  href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2025/2025_Rental_IncomeLimits.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2025/2025_Rental_IncomeLimits.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Income and Rent Limits (FY 2025)
                </a>

                <div className="fw-light">
                  PDF — Seattle Office of Housing — April 25, 2025
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <div className="fw-light">General renters' guide</div>
                <a
                  id="renters-guide"
                  href="https://www.seattle.gov/rentinginseattle/renters"
                  title="https://www.seattle.gov/rentinginseattle/renters"
                  target="_blank"
                  rel="noreferrer"
                >
                  Renting in Seattle
                </a>
                <div className="fw-light">
                  website — Seattle Office of Housing
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default ResourcesPage;
