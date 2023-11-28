import {  Container, Row, Card, Col } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

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
