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
                  Seattle Office of Housing homepage with contact information.
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
                  Information about MFTE and other income and rent-restricted
                  programs.
                </div>
                <a
                  id="mfte-city-website-renters"
                  href="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
                  title="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
                  target="_blank"
                  rel="noreferrer"
                >
                  MFTE Main Resources Page
                </a>

                <div className="fw-light">
                  website — Seattle Office of Housing
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <div className="fw-light">
                  Market-Rate Rental Properties with Affordable Housing Units
                  spreadsheet.
                </div>
                <a
                  id="properties-spreadsheet-april-2024"
                  href="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  MFTE Spreadsheet of Buildings
                </a>

                <div className="fw-light">
                  PDF — Seattle Office of Housing — April 2024
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <a
                  id="income-and-rent-limits"
                  href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Income and Rent Limits (FY 2024)
                </a>

                <div className="fw-light">
                  PDF — Seattle Office of Housing — April 22, 2024
                </div>
              </ListGroup.Item>

              <ListGroup.Item style={{ background: "none" }}>
                <div className="fw-light">
                  Renters' Guide for Market-Rate Apartment Buildings with
                  Affordable Units.
                </div>
                <a
                  id="renters-guide"
                  href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Renters_Guide_7-2023.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Renters_Guide_7-2023.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Detailed Renters' Guide
                </a>
                <div className="fw-light">
                  PDF — Seattle Office of Housing — July 2023
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
