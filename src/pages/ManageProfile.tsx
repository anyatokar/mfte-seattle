import { Profiler } from "react";
import Profile from "../components/Profile";
import { isProfilerOn } from "../config/constants";
import { useAuth } from "../contexts/AuthContext";
import IPage from "../interfaces/IPage";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ManageProfilePage: React.FC<IPage> = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <Profiler
      id={"Manage Profile"}
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
      <Container fluid className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="display-6 mb-5">Profile</div>
            <Profile />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default ManageProfilePage;
