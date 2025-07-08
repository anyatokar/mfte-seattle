import Profile from "../../components/Profile";
import config from "../../config/config";
import { useAuth } from "../../contexts/AuthContext";
import RenderProfiler from "../../components/RenderProfiler";
import IPage from "../../interfaces/IPage";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ManageProfilePage: React.FC<IPage> = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <RenderProfiler id="Manager Profile" isProfilerOn={config.debug.isProfilerOn}>
      <Container fluid className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="display-6 mb-5">Profile</div>
            <Profile />
          </Col>
        </Row>
      </Container>
    </RenderProfiler>
  );
};

export default ManageProfilePage;
