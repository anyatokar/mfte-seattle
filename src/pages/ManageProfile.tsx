import { Profiler } from "react";
import Profile from "../components/Profile";
import { isProfilerOn } from "../config/config";
import { useAuth } from "../contexts/AuthContext";
import IPage from "../interfaces/IPage";

import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

const ManageProfilePage: React.FunctionComponent<IPage> = () => {
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
            <div className="display-5">Profile</div>
            <hr className="my-4 break-line-light" />
            <Profile />
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default ManageProfilePage;
