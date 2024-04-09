import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom"; // Assuming you are using React Router for navigation

const SiteMap = () => {
  return (
    <Nav className="justify-content-center">
      <Nav.Item className="px-3 px-md-4  pt-3">
        <Link className="footer-nav-link-custom" to="/all-buildings">
          MFTE Map
        </Link>
      </Nav.Item>
      {/* <Nav.Item className="p-1">| </Nav.Item> */}
      <Nav.Item className="px-3  px-md-4 pt-3">
        <Link className="footer-nav-link-custom" to="/resources">
          Resources
        </Link>
      </Nav.Item>
      {/* <Nav.Item className="p-1">| </Nav.Item> */}
      <Nav.Item className="px-3  px-md-4 pt-3">
        <Link className="footer-nav-link-custom" to="/contact">
          Contact Us
        </Link>
      </Nav.Item>
      {/* <Nav.Item className="p-1">| </Nav.Item> */}
      <Nav.Item className="px-3   px-md-4  pt-3">
        <Link className="footer-nav-link-custom" to="/privacy-policy">
          Privacy Policy
        </Link>
      </Nav.Item>
      {/* <Nav.Item className="p-1">| </Nav.Item> */}
      <Nav.Item className="px-3  px-md-4 pt-3">Copyright © 2021-2024 Anya Tokar</Nav.Item>
    </Nav>
  );
};

export default SiteMap;
