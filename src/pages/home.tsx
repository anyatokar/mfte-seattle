import React, { useEffect } from "react";
import IPage from "../interfaces/IPage";
import logging from "../config/logging";
import { useHistory } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";

const HomePage: React.FunctionComponent<IPage> = (props) => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name]);

  const history = useHistory();

  function onClick(event: any) {
    event.preventDefault();
    history.push(event.target.value);
  }

  return (
    <Container className="all-pages diy-jumbotron">
      <Row className="justify-content-center">
        <Col lg={10} xl={8}>
          <div className="display-5">MFTE Seattle</div>
          <hr className="my-4"></hr>

          <p className="lead">Find modern rent-reduced apartments in Seattle through the Multifamily Tax Exemption (MFTE) program.</p>
          <p className="lead">
            View participating buildings on the&nbsp;
            <a id="Buildings_tab" href="./Buildings" title="View a map of MFTE properties">
              MFTE map
            </a>. Create an account to save buildings and keep notes. Contact buildings directly for current availability.
          </p>
          <p className="lead">
            This website is not affiliated with the Seattle Office of Housing. Please view official government resources for complete information about
            rent-reduced and affordable housing programs.
          </p>

          <Button className="btn-lg col-lg-4 col-xl-3 mt-1" variant="outline-info" onClick={onClick} value="./buildings">
            MFTE Map
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
