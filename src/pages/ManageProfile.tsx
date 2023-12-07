import { Profiler } from "react";
import { useAuth } from "../contexts/AuthContext";
import UpdateProfile from "../auth_components/UpdateProfile";
import Profile from "../components/Profile";
import { RouteComponentProps, withRouter } from "react-router-dom";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

const ManageProfilePage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = (props) => {
  const { currentUser } = useAuth() as any;

  if (!currentUser) {
    return null;
  }

  return (
    <Profiler
      id={props.name}
      onRender={(id, phase, actualDuration) => {
        console.log({ id, phase, actualDuration });
      }}
    >
      <Container fluid className="all-pages">
        <Tab.Container id="sidebar" defaultActiveKey="profile">
          <Row>
            <Col sm={12} lg={2}>
              <Nav variant="pills" className="flex-column side-nav">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="tab">
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="update" className="tab">
                    Edit Profile
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={12} lg={9} className="p-0">
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <Profile />
                </Tab.Pane>
                <Tab.Pane eventKey="update">
                  <UpdateProfile />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Profiler>
  );
};

export default withRouter(ManageProfilePage);
