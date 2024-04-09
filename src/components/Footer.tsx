import houses from "../assets/images/houses.png";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

import SiteMap from "./SiteMap";

// alt is empty per accessibility guidelines for decorative images.

export const Footer = () => {
  return (
    <Container fluid className="footer">
      <Row>
        <Col className="p-0">
          <Image className="footer-img" src={houses} alt="" />
        </Col>
      </Row>
      <Row className="justify-content-center pb-3">
        <Col>
          <SiteMap />
        </Col>
      </Row>
    </Container>
  );
};
