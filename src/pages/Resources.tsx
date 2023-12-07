import { Profiler } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

const ResourcesPage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = (props) => {
  return (
    <Profiler
      id={props.name}
      onRender={(id, phase, actualDuration) => {
        console.log({ id, phase, actualDuration });
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-5">Resources</div>
            <hr className="my-4"></hr>

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
                  id="mfte-city-website"
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
                  id="properties-spreadsheet-may-2023"
                  href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
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
                  PDF — City of Seattle — October 2023
                </div>
              </ListGroup.Item>

              <ListGroup.Item>
                <a
                  id="income-and-rent-limits"
                  href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2023_Income_Rent_Limits_Rental.pdf"
                  title="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2023_Income_Rent_Limits_Rental.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  Income and Rent Limits (FY 2023)
                </a>
                <div></div>
                <div className="fw-light">
                  PDF — City of Seattle — May 15, 2023
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
              <ListGroup.Item>
                <a
                  id="mfte-faqs"
                  href="https://www.seattle.gov/Documents/Departments/Housing/Renters/MFTE%20FAQ.pdf"
                  title="https://www.seattle.gov/Documents/Departments/Housing/Renters/MFTE%20FAQ.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="fw-bold"
                >
                  MFTE FAQs
                </a>
                <div className="fw-light">
                  Two-page overview of the MFTE program. Note the map and income
                  limits are outdated.
                </div>
                <div className="fw-light">PDF — City of Seattle — 2018</div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default withRouter(ResourcesPage);
