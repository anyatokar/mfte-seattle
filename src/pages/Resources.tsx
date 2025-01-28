import { Profiler } from "react";
import { isProfilerOn } from "../config/config";
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
            <div className="display-5">Resources</div>
            <hr className="my-4 break-line-light" />

            <ListGroup>
              <ListGroup.Item>
                <a
                  id="seattle-housing-website"
                  href="https://seattle.gov/housing"
                  title="https://seattle.gov/housing"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  Seattle Office of Housing
                </a>
                <div className="fw-light">
                  Seattle Office of Housing homepage with contact information.
                </div>
                <div className="fw-light">website — City of Seattle</div>
              </ListGroup.Item>

              <ListGroup.Item>
                <a
                  id="mfte-city-website-renters"
                  href="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
                  title="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  MFTE Main Resources Page
                </a>
                <div className="fw-light">
                  Information about the MFTE program and other income and
                  rent-restricted properties.
                </div>
                <div className="fw-light">website — City of Seattle</div>
              </ListGroup.Item>

              <ListGroup.Item>
                <a
                  id="properties-spreadsheet-april-2024"
                  href="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  MFTE Spreadsheet of Buildings
                </a>
                <div className="fw-light">
                  Market-Rate Rental Properties with Affordable Housing Units
                  spreadsheet.
                </div>
                <div className="fw-light">
                  PDF — City of Seattle — April 2024
                </div>
              </ListGroup.Item>

              <ListGroup.Item>
                <a
                  id="income-and-rent-limits"
                  href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2024/2024_RentIncomeLimits_5.28.24.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  Income and Rent Limits (FY 2024)
                </a>
                <div></div>
                <div className="fw-light">
                  PDF — City of Seattle — April 22, 2024
                </div>
              </ListGroup.Item>

              <ListGroup.Item>
                <a
                  id="renters-guide"
                  href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Renters_Guide_7-2023.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Renters_Guide_7-2023.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  Detailed Renters' Guide
                </a>
                <div className="fw-light">
                  Renters' Guide for Market-Rate Apartment Buildings with
                  Affordable Units.
                </div>
                <div className="fw-light">
                  PDF — City of Seattle — July 2023
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
