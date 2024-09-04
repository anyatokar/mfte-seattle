import { Profiler } from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = (
  props
) => {
  return (
    <Profiler
      id={props.name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        console.log({
          id,
          phase,
          actualDuration,
          baseDuration,
          startTime,
          commitTime,
        });
      }}
    >
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="display-5">About</div>
            <hr className="my-4 break-line-light" />
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col>
            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Purpose</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  The purpose of this website is to help people find safe and
                  comfortable rent-reduced housing. It aims to supplement
                  existing government resources by mapping all buildings that
                  participate in the MFTE (Multifamily Tax Exemption) program.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Disclaimers</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  MFTE is a government program. This website is not affiliated
                  with the Seattle Office of Housing or any government office.
                  For official information about MFTE please visit the&nbsp;
                  <a
                    id="seattle-housing-website"
                    href="https://seattle.gov/housing"
                    title="https://seattle.gov/housing"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Seattle Office of Housing website
                  </a>
                  .
                </div>
                <div className="lead mt-2">
                  Contact building property management directly for current
                  information about apartment vacancies or renter
                  qualifications.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Why MFTE</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  This website highlights the MFTE program because of the
                  relatively quick application turnaround, higher availability,
                  and modern apartments in sought-after locations.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Data Source</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Buildings are sourced from the spreadsheet of&nbsp;
                  <a
                    id="properties-spreadsheet-april-2024"
                    href="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                    title="https://www.seattle.gov/documents/Departments/Housing/Renters/Affordable_Rental_Housing_MFTE-MHA-IZ.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Market-Rate Rental Properties with Affordable Housing Units
                    Regulated by the City of Seattle (April 2024)
                  </a>
                  . Updated spreadsheets are published by the Seattle Office of
                  Housing roughly twice a year.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Use</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Search and filter for apartments that fit your criteria (such
                  as number of bedrooms, neighborhood, and building name).
                  Create a free login to keep a short list of properties, view a
                  personalized map, and add notes. Explore the&nbsp;
                  <Link id="all-buildings" to="./all-buildings">
                    MFTE map
                  </Link>
                  &nbsp;to get started.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Ownership</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  This website was created by an&nbsp;
                  <a
                    id="ada-website"
                    href="https://adadevelopersacademy.org/"
                    title="https://adadevelopersacademy.org/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ada Developers Academy
                  </a>
                  &nbsp;grad (and former MFTE apartment resident) in 2021 as her
                  capstone project. It is an&nbsp;
                  <a
                    id="github-link"
                    href="https://github.com/anyatokar/mfte-seattle"
                    title="MFTE Seattle GitHub"
                    target="_blank"
                    rel="noreferrer"
                  >
                    open-source project
                  </a>
                  .
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default withRouter(AboutPage);
