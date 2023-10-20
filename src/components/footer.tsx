import houses from '../assets/images/houses.png';
import { Col, Container, Image, Row } from 'react-bootstrap';

export const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="p-0">
          <Image src={houses} alt="Colorful houses in a neighborhood" className="footer-img"/>
        </Col>
      </Row>
      <Row>
        <Col className="text-center p-0">Copyright © 2021-2023 Anya Tokar</Col>
      </Row>
    </Container>
  )
}
