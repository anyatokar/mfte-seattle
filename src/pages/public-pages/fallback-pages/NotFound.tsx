import { isProfilerOn } from "../../../config/constants";
import RenderProfiler from "../../../components/RenderProfiler";
import IPage from "../../../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const NotFoundPage: React.FC<IPage> = () => {
  return (
    <RenderProfiler id="NotFound" isProfilerOn={isProfilerOn}>
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-6">404: Not Found</div>
            <p className="lead">Try navigating to a different page.</p>
          </Col>
        </Row>
      </Container>
    </RenderProfiler>
  );
};

export default NotFoundPage;
