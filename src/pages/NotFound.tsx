import { Profiler } from "react";
import { isProfilerOn } from "../config/config";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const NotFoundPage: React.FC<IPage> = () => {
  return (
    <Profiler
      id={"Not Found"}
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
            <div className="display-6">404: Not Found</div>
            <p className="lead">Try navigating to a different page.</p>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default NotFoundPage;
