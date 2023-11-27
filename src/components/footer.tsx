import houses from "../assets/images/houses.png";
import { Col, Container, Image, Row } from "react-bootstrap";

// alt is empty per accessibility guidelines for decorative images.

export const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="p-0">
          <Image className="footer-img" src={houses} alt="" />
        </Col>
      </Row>
      <Row>
        <Col className="p-0 text-center">Copyright © 2021-2023 Anya Tokar</Col>
      </Row>
    </Container>
  );
};
