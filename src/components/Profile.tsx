import { useAuth } from "../contexts/AuthContext";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

export default function Profile() {
  const { currentUser } = useAuth() as any;

  if (!currentUser) {
    return null;
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Name: </strong>
                {currentUser.displayName}
              </Card.Text>
              <Card.Text>
                <strong>Email: </strong>
                {currentUser.email}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
