import { Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Container, Row, Col } from "react-bootstrap";

export default function Profile() {
  const { currentUser } = useAuth() as any;

  return (
    currentUser && (
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
    )
  );
}
