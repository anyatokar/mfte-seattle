import { Profiler } from "react";
import { isProfilerOn } from "../config/constants";
import IPage from "../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

const resources = [
  {
    id: "seattle-housing-website",
    href: "https://seattle.gov/housing",
    label: "Seattle Office of Housing",
    description: "Seattle Office of Housing homepage with contact information",
    footer: "website — Seattle Office of Housing",
  },
  {
    id: "mfte-city-website-renters",
    href: "https://www.seattle.gov/housing/renters/find-housing",
    label: "Find Affordable Rental Housing Page",
    description: "Information about MFTE and other rent-reduced programs",
    footer: "website — Seattle Office of Housing",
  },
  {
    id: "income-and-rent-limits",
    href: "https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2025/2025_Rental_IncomeLimits.pdf",
    label: "Income and Rent Limits (FY 2025)",
    description: null,
    footer: "PDF — Seattle Office of Housing — April 25, 2025",
  },
  {
    id: "renters-guide",
    href: "https://www.seattle.gov/rentinginseattle/renters",
    label: "Renting in Seattle",
    description: "General renters' guide",
    footer: "website — Seattle Office of Housing",
  },
  {
    id: "arch-rental-program",
    href: "https://www.archhousing.org/rental-program",
    label: "ARCH Rental Program",
    description: null,
    footer:
      "website — ARCH (A Regional Coalition for Housing) — a partnership of the County and East King County Cities working to preserve and increase the supply of housing for low and moderate income households in the region",
  },
  {
    id: "arch-renter-resources",
    href: "https://www.archhousing.org/renter-resources",
    label: "ARCH Rental Assistance and Other Resources",
    description:
      "A list of resources such as emergency shelters, rental assistance, and legal representation",
    footer: "website — ARCH",
  },
  {
    id: "crh-home",
    href: "https://communityrootshousing.org/",
    label: "Community Roots Housing",
    description: "Community Roots Housing homepage",
    footer:
      "website — Community Roots Housing — builds, preserves, and operates affordable homes to rent throughout the Seattle area",
  },
  {
    id: "crh-search",
    href: "https://communityrootshousing.org/find-apartment/",
    label: "Community Roots Housing available apartment search",
    description: null,
    footer: "website — Community Roots Housing",
  },
  {
    id: "kcha-home",
    href: "https://www.kcha.org/",
    label: "King County Housing Authority",
    description: "King County Housing Authority homepage",
    footer: "website — King County Housing Authority",
  },
];

const ResourcesPage: React.FC<IPage> = () => {
  const onRender = (
    id: string,
    phase: string,
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    if (isProfilerOn) {
      console.log({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
      });
    }
  };

  return (
    <Profiler id="Resources" onRender={onRender}>
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-6 mb-5">Resources</div>
            <ListGroup variant="flush">
              {resources.map(({ id, href, label, description, footer }) => (
                <ListGroup.Item key={id} style={{ background: "none" }}>
                  {description && <div className="fw-light">{description}</div>}
                  <a
                    id={id}
                    href={href}
                    title={href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {label}
                  </a>
                  {footer && <div className="fw-light">{footer}</div>}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Profiler>
  );
};

export default ResourcesPage;
