import { Link } from "react-router-dom";
import { isProfilerOn } from "../../config/constants";
import RenderProfiler from "../../components/RenderProfiler";
import IPage from "../../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const AboutPage: React.FC<IPage> = () => {
  return (
    <RenderProfiler id="About" isProfilerOn={isProfilerOn}>
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="display-6 mb-5">About</div>
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
                  The purpose of this website is to help people find
                  rent-reduced housing in Seattle by featuring currently
                  available and generally existing units in a user-friendly and
                  accessible way.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">
                  How to use this website for prospective renters
                </div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Search and filter apartments that fit your criteria. Create a
                  free login to keep a short list of properties, view a
                  personalized map, and add notes. Explore the{" "}
                  <Link id="all-buildings" to="../all-buildings">
                    map
                  </Link>{" "}
                  to get started.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Do I qualify?</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Your household income must fall within the income limit for
                  the apartment, which is based on a percentage of the area
                  median income (% AMI). Each building may have additional
                  requirements. Reach out to building management for complete
                  information.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">How do I apply?</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Each building manages their own application process so contact
                  the building directly. The distinction between types of
                  rent-reduced programs featured on this website (MFTE, IZ, MHA,
                  and MPC-YT) does not make a difference for the application
                  process. Many properties use MFTE as a blanket term for
                  rent-reduced programs.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">
                  How to use this website for property managers
                </div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Create a free manager account to add and update listings for
                  your buildings. View the{" "}
                  <Link id="for-managers" to="../for-managers">
                    property managers
                  </Link>{" "}
                  page for complete information.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Which programs are mapped?</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  Multifamily Tax Exemption (MFTE), Incentive Zoning (IZ),
                  Mandatory Housing Affordability (MHA), and Master Planned
                  Community (MPC)-Yesler Terrace. Data is sourced from the
                  Seattle Office of Housing and from direct communication with
                  property owners. If you would like to see another type of
                  program mapped, please use the{" "}
                  <Link id="contact-us" to="../contact">
                    contact us
                  </Link>{" "}
                  form to suggest it.
                </div>
              </Col>
            </Row>

            <Row className="align-items-center pb-3">
              <Col lg={2} className="text-lg-end">
                <div className="fs-4">Ownership</div>
              </Col>
              <Col lg={8}>
                <div className="lead">
                  <p>
                    Created by an{" "}
                    <a
                      id="ada-website"
                      href="https://adadevelopersacademy.org/"
                      title="https://adadevelopersacademy.org/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ada Developers Academy
                    </a>{" "}
                    grad (and former MFTE apartment resident) in 2021. This is
                    an{" "}
                    <a
                      id="github-link"
                      href="https://github.com/anyatokar/mfte-seattle"
                      title="MFTE Seattle GitHub"
                      target="_blank"
                      rel="noreferrer"
                    >
                      open-source project
                    </a>{" "}
                    and feedback and contributions are greatly appreciated.
                    Please get in touch!
                  </p>
                  <p>
                    Not affiliated with the Seattle Office of Housing or any
                    building management company.
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </RenderProfiler>
  );
};

export default AboutPage;
