import { useAuth } from "../contexts/AuthContext";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { accountTypeEnum } from "../types/enumTypes";

type ProfileProps = {
  jobTitle?: string;
  companyName?: string;
};

const Profile: React.FC<ProfileProps> = ({ jobTitle, companyName }) => {
  const { currentUser, accountType } = useAuth();

  if (!currentUser) {
    return null;
  }

  return (
    <Container fluid>
      <Row>
        <Col lg={6}>
          <Card>
            <Card.Body>
              <Card.Text>
                <strong>Name: </strong>
                {currentUser.displayName}
              </Card.Text>
              <Card.Text>
                <strong>Email: </strong>
                {currentUser.email}
              </Card.Text>
              {accountType === accountTypeEnum.MANAGER && (
                <>
                  <Card.Text>
                    <strong>Job Title: </strong>
                    {jobTitle}
                  </Card.Text>
                  <Card.Text>
                    <strong>Company: </strong>
                    {companyName}
                  </Card.Text>
                  <Card.Text>
                    <strong>Account Type: </strong>
                    Manager
                  </Card.Text>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
