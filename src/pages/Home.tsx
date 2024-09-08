import { Profiler } from "react";
import { Link, useHistory } from "react-router-dom";
import IPage from "../interfaces/IPage";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const HomePage: React.FunctionComponent<IPage> = ({ name }) => {
  const history = useHistory();

  function onClick(event: any) {
    event.preventDefault();
    history.push(event.target.value);
  }

  return (
    <Profiler
      id={name}
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
          <Col lg={10} xl={8}>
            <div className="display-5">MFTE Seattle</div>
            <hr className="my-4 break-line-light" />
            <p className="lead">
              Find modern rent-reduced apartments in Seattle through the
              Multifamily Tax Exemption (MFTE) program.
            </p>
            <p className="lead">
              View participating buildings on the&nbsp;
              <Link id="all-buildings" to="./all-buildings">
                MFTE map
              </Link>
              . Create an account to save buildings and keep notes. Contact
              buildings directly for current availability.
            </p>
            <p className="lead">
              This website is not affiliated with the Seattle Office of Housing.
              Please view official government resources for complete information
              about rent-reduced and affordable housing programs.
            </p>

            <Row>
              <Col lg={4} xl={3}>
                <Button
                  className="diy-outline-info-button w-100"
                  size="lg"
                  onClick={onClick}
                  value="./all-buildings"
                >
                  MFTE Map
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default HomePage;
