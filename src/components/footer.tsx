import houses from '../assets/images/houses.png';
import { Col, Container, Image, Row } from 'react-bootstrap';

export const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="p-0">
        </Col>
      </Row>
      <Row>
        <Col className="p-0 text-center">
          Copyright © 2021-2023 Anya Tokar
        </Col>
      </Row>
    </Container>
  )
}
