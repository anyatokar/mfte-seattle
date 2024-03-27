import houses from "../assets/images/houses.png";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

import { LinkContainer } from "react-router-bootstrap";

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
        <Col className="p-0 text-center">
          <LinkContainer to="/privacy-policy">
            <Nav.Link active={false}>Privacy Policy</Nav.Link>
          </LinkContainer>
        </Col>
      </Row>
      <Row>
        <Col className="p-0 text-center">Copyright © 2021-2024 Anya Tokar</Col>
      </Row>
    </Container>
  );
};
