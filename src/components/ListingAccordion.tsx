import Accordion from "react-bootstrap/esm/Accordion";
import { Link } from "react-router-dom";

const ListingAccordion: React.FC = () => {
  return (
    <>
      <p className="lead">
        Looking to reach more prospective tenants for MFTE units?
      </p>
      <p>
        List your currently available or soon-to-be-available MFTE apartments on
        this website by filling out the brief form below. This is an opportunity
        to increase your building's visibility to people searching for
        rent-reduced housing.
      </p>

      <p>Please submit one form per building.</p>
      <p>
        For general questions use the&nbsp;
        <Link id="all-buildings" to="./contact">
          Contact
        </Link>
        &nbsp;page.
      </p>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>How Your Listing Will Be Featured</Accordion.Header>
          <Accordion.Body>
            <p>
              On the map, buildings with available units are marked with red
              pins and link to the building's official leasing page. Dark blue
              pins represent buildings without listings.
            </p>
            <p>
              In list view, buildings with available units are shown at the top.
              Each listing includes a link to the building’s leasing page, as
              well as details on the number of available units and the earliest
              availability date.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>How to Add Your Listing</Accordion.Header>
          <Accordion.Body>
            <ol>
              <li>
                Fill out the form below. You will need the following
                information:
              </li>
              <ul>
                <li>
                  A listing url that will get the user as close as possible to
                  viewing the available MFTE units for the building.
                </li>
                <li>
                  How many of each unit size is currently or soon will be
                  available.
                </li>
                <li>
                  For each available unit size, the earliest availability date.
                </li>
              </ul>
              <li>We will review the submitted information.</li>
              <li>
                Upon approval, you will receive a confirmation email, at which
                time your property will be featured as described above.
              </li>
            </ol>
            <p>
              To make updates or remove the listing, please reply to the
              confirmation email you receive.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Website Metrics</Accordion.Header>
          <Accordion.Body>
            <p>
              This website averages 3,000 active monthly users and consistently
              ranks as a top search result for MFTE properties in Seattle across
              major search engines.
            </p>
            <p>
              Recognizing that more than half of our visits come from mobile
              devices, this site provides an optimized experience across phones,
              tablets, and desktops, making it easier for a wider range of users
              to find MFTE units.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Disclaimer</Accordion.Header>
          <Accordion.Body>
            <p>
              This website maps buildings participating in the MFTE program
              using publicly available data. It is not affiliated with the
              Seattle Office of Housing or any other government agency.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ListingAccordion;
