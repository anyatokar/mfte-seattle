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
                <div className="fs-4">Why MFTE</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  We chose to highlight the MFTE program because of the
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
                    id="properties-spreadsheet-may-2023"
                    href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Market-Rate Rental Properties with Affordable Housing Units
                    Regulated by the City of Seattle (October 2023)
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
                <div className="fs-4">Disclaimer</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  MFTE is not the only rent-reduced program, and it's not
                  available to everyone. Please view official government
                  resources for complete information on rent-reduced and
                  affordable housing programs in Seattle.
                </div>
                <div className="lead">
                  We do not provide insight on current availability in each
                  building or details on renter qualifications. The best way to
                  learn this information is to get in touch with property
                  management directly.
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
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ada Developers Academy
                  </a>
                  &nbsp;grad (and former MFTE apartment resident) in 2021 as her
                  capstone. It is an&nbsp;
                  <a
                    id="github-link"
                    href="https://github.com/anyatokar/mfte-seattle"
                    title="MFTE Seattle GitHub"
                    target="_blank"
                    rel="noreferrer"
                  >
                    open source project
                  </a>
                  .
                </div>
              </Col>
            </Row>

            <Row className="align-items-center py-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Privacy</div>
              </Col>
              <Col>
                <div className="lead">
                  We do not share your information with anyone.
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
