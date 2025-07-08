import { isProfilerOn } from "../../config/constants";
import RenderProfiler from "../../components/RenderProfiler";
import IPage from "../../interfaces/IPage";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";

type resourceGroupsType = {
  title: string;
  overallDescription: string;
  items: {
    id: string;
    href: string;
    label: string;
    description: string | null;
  }[];
}[];
const resourceGroups: resourceGroupsType = [
  {
    title: "Seattle Office Of Housing",
    overallDescription:
      "An official resource for MFTE and other rent-reduced programs.",
    items: [
      {
        id: "seattle-housing-website",
        href: "https://seattle.gov/housing",
        label: "Seattle Office of Housing Homepage",
        description:
          "Seattle Office of Housing homepage with contact information",
      },
      {
        id: "mfte-city-website-renters",
        href: "https://www.seattle.gov/housing/renters/find-housing",
        label: "Find Affordable Rental Housing Page",
        description: "Information about MFTE and other rent-reduced programs",
      },
      {
        id: "income-and-rent-limits",
        href: "https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2025/2025_Rental_IncomeLimits.pdf",
        label: "Income and Rent Limits (FY 2025)",
        description: null,
      },
      {
        id: "renters-guide",
        href: "https://www.seattle.gov/rentinginseattle/renters",
        label: "Renting in Seattle",
        description: "General renters' guide",
      },
    ],
  },
  {
    title: "ARCH (A Regional Coalition for Housing)",
    overallDescription:
      "A partnership of King County and East King County cities working to preserve and increase the supply of housing for low- and moderate-income households in the region. Similarly to the Seattle Office of Housing, ARCH maintains its own list of income-restricted rental units.",
    items: [
      {
        id: "arch-rental-program",
        href: "https://www.archhousing.org/rental-program",
        label: "ARCH Rental Program",
        description:
          "Detailed resource about the ARCH rental program including contact information",
      },
      {
        id: "arch-renter-resources",
        href: "https://www.archhousing.org/renter-resources",
        label: "ARCH Rental Assistance and Other Resources",
        description:
          "🚨 A list of resources such as emergency shelters, rental assistance, and legal representation",
      },
    ],
  },
  {
    title: "Community Roots Housing",
    overallDescription:
      "Builds, preserves, and operates affordable homes to rent throughout the Seattle area.",
    items: [
      {
        id: "crh-home",
        href: "https://communityrootshousing.org/",
        label: "Community Roots Housing Homepage",
        description: null,
      },
      {
        id: "crh-search",
        href: "https://communityrootshousing.org/find-apartment/",
        label: "Community Roots Housing available apartment search",
        description: null,
      },
    ],
  },
  {
    title: "King County Housing Authority",
    overallDescription:
      "An agency providing affordable housing and rental assistance programs throughout King County.",
    items: [
      {
        id: "kcha-home",
        href: "https://www.kcha.org/",
        label: "King County Housing Authority Homepage",
        description: null,
      },
    ],
  },
];

const ResourcesPage: React.FC<IPage> = () => {
  return (
    <RenderProfiler id="Resources" isProfilerOn={isProfilerOn}>
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div className="display-6 mb-5">Resources</div>
            <ListGroup variant="flush">
              {resourceGroups.map((group) => (
                <div key={group.title} className="mb-4">
                  <h5 className="fw-bold">{group.title}</h5>
                  <div className="fw-light mb-2">
                    {group.overallDescription}
                  </div>
                  {group.items.map(({ id, href, label, description }) => (
                    <ListGroup.Item key={id} style={{ background: "none" }}>
                      <a
                        id={id}
                        href={href}
                        title={href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {label}
                      </a>
                      {description && (
                        <div className="fw-light">{description}</div>
                      )}
                    </ListGroup.Item>
                  ))}
                </div>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </RenderProfiler>
  );
};

export default ResourcesPage;
