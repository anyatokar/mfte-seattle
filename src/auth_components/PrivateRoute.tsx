import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";
import { accountTypeEnum } from "../types/enumTypes";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

type PrivateRouteProps = {
  children: ReactNode;
  name: string;
};

export default function PrivateRoute({ children, name }: PrivateRouteProps) {
  const { currentUser, accountType } = useAuth();

  function isAuthorized() {
    return (
      currentUser &&
      ((name === "Manage Listings Page" &&
        accountType === accountTypeEnum.MANAGER) ||
        (name === "Saved Buildings Page" &&
          accountType === accountTypeEnum.RENTER) ||
        name === "Manage Profile Page")
    );
  }

  if (accountType !== null && !isAuthorized()) {
    return (
      // TODO: Can move to its own component.
      <Container className="all-pages diy-jumbotron">
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            <div>
              <p className="lead">
                {" "}
                You may not be authenticated or lack the permissions required to
                view this page.
              </p>
              {name === "Manage Listings Page" && (
                <p className="lead">
                  The Manage Listings page restricted to manager accounts.
                </p>
              )}
              {name === "Saved Buildings Page" && (
                <p className="lead">
                  The Saved Buildings page is restricted to non-manager
                  accounts.
                </p>
              )}
              {name === "Manage Profile Page" && (
                <p className="lead">Please log in to access your profile.</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (accountType !== null && isAuthorized()) {
    return <>{children}</>;
  }
}
