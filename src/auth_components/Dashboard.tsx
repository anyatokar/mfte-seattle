import { Nav, Tab, Row, Col, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import UpdateProfile from "./UpdateProfile";
import Profile from "./Profile";

export default function Dashboard() {
  const { currentUser } = useAuth() as any;

  if (!currentUser) { 
    return null;
  }

  return (
    <Container fluid className="pills-page">
      <Tab.Container id="sidebar" defaultActiveKey="profile">
        <Row>
          <Col lg={2}>
            <Nav variant="pills" className="flex-column side-nav">
              <Nav.Item>
                <Nav.Link eventKey="profile" className="tab">Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="update" className="tab">Update Profile</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col lg={10} className="p-0">
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
  );
}
