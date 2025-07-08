import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const SiteMap = () => {
  return (
    <Nav className="justify-content-center">
      <Nav.Item className="px-3 px-md-4 pt-1">
        <Link className="footer-nav-link-custom" to="/all-buildings">
          MFTE Map
        </Link>
      </Nav.Item>
      <Nav.Item className="px-3 px-md-4 pt-1">
        <Link className="footer-nav-link-custom" to="/resources">
          Resources
        </Link>
      </Nav.Item>
      <Nav.Item className="px-3 px-md-4 pt-1">
        <Link className="footer-nav-link-custom" to="/contact">
          Contact
        </Link>
      </Nav.Item>
      <Nav.Item className="px-3 px-md-4 pt-1">
        <Link className="footer-nav-link-custom" to="/privacy">
          Privacy Policy
        </Link>
      </Nav.Item>
      <Nav.Item className="px-3 px-md-4 pt-1">
        <Link className="footer-nav-link-custom" to="/cookies">
          Cookie Policy
        </Link>
      </Nav.Item>
      <Nav.Item className="px-3 px-md-4 pt-1">
        Copyright © 2021-2025 Anya Tokar
      </Nav.Item>
    </Nav>
  );
};

export default SiteMap;
