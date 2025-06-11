import { useContext } from "react";
import Accordion from "react-bootstrap/Accordion";
import { ModalContext, ModalState } from "../contexts/ModalContext";
import Button from "react-bootstrap/Button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const ListingAccordion: React.FC = () => {
  const [, /* modalState */ setModalState] = useContext(ModalContext);
  const handleShowSignUp = () => setModalState(ModalState.REP_SIGNUP);
  const handleShowLogin = () => setModalState(ModalState.LOGIN_MANAGE_LISTINGS);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const onManageListingsClick = () => {
    if (currentUser) {
      navigate("/manage-listings");
    } else {
      handleShowLogin();
    }
  };

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            How Your Listings Will Be Featured
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Prospective renters can filter the map and buildings list by known
              availability.
            </p>
            <p>
              In list view, buildings with available units are displayed at the
              top.
            </p>
            <p>
              Each listing includes a link to the building’s listing page, an
              optional short description and links, as well as a table of
              available units with unit size, % AMI, program type/income limits,
              monthly rent, apartment #s, and move-in date.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Adding Your Listings</Accordion.Header>
          <Accordion.Body>
            <p>If you already have a manager account, skip to step 2.</p>
            <ol>
              <li className="mb-3">
                Log out of your personal account (if applicable).{" "}
                <Button
                  variant="link"
                  id="manager-signup-modal"
                  onClick={handleShowSignUp}
                  className="p-0 m-0  align-baseline"
                >
                  Create a manager account
                </Button>{" "}
                using your company email. This account will allow you to add
                buildings and manage their availability. Only one account can be
                associated with each email, so you may need to delete any
                existing account and re-register to ensure proper permissions.
              </li>
              <li className="mb-3">
                Navigate to the{" "}
                <Button
                  variant="link"
                  id="manage-listings"
                  onClick={onManageListingsClick}
                  className="p-0 m-0 align-baseline"
                >
                  Listings
                </Button>{" "}
                tab. You will be prompted to login if you haven't done so
                already. From there, you can submit an Add Listing form for each
                building with current or upcoming availability.
              </li>
              <li>
                We will review and approve the submission, at which point the
                property will be featured as described above. If we have any
                questions, we will contact you via email. You can update your
                listing without needing further approvals unless it is archived
                or deleted.
              </li>
            </ol>
            <p>
              Listings automatically expire after 60 days but can easily be
              renewed through your manager account.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>Website Metrics</Accordion.Header>
          <Accordion.Body>
            <p>
              This website averages 3,500 active monthly users and consistently
              ranks as a top result for MFTE properties in Seattle across search
              engines. It provides an accessible and optimized experience across
              devices, making it easier for a wide range of users to find
              rent-reduced apartments that fit their criteria.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>Disclaimer</Accordion.Header>
          <Accordion.Body>
            <p>
              This website maps buildings participating in rent-reduced programs
              using publicly available data. It is not affiliated with the
              Seattle Office of Housing or other government agencies.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default ListingAccordion;
