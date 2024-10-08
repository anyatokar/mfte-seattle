import { useAuth } from "../contexts/AuthContext";

import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { accountTypeEnum } from "../types/enumTypes";
import { getManagerProfileFirestore } from "../utils/firestoreUtils";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";

export default function Profile() {
  const { currentUser, accountType } = useAuth();
  const [managerProfile, setManagerProfile] = useState<DocumentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser && accountType === accountTypeEnum.MANAGER) {
        try {
          const profileData = await getManagerProfileFirestore(currentUser.uid);
          setManagerProfile(profileData);
        } catch (error) {
          console.error("Error fetching manager profile:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, []);

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
                <Card.Text>
                  <strong>Title: </strong>
                  {managerProfile?.jobTitle}
                </Card.Text>
              )}
              {accountType === accountTypeEnum.MANAGER && (
                <Card.Text>
                  <strong>Company: </strong>
                  {managerProfile?.companyName}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
