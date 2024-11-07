import { Profiler, useEffect, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import UpdateProfile from "../auth_components/UpdateProfile";
import Profile from "../components/Profile";
import { isProfilerOn } from "../config/config";
import IPage from "../interfaces/IPage";

import { DocumentData } from "firebase/firestore";
import { accountTypeEnum } from "../types/enumTypes";
import { getManagerProfileFirestore } from "../utils/firestoreUtils";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";

const ManageProfilePage: React.FunctionComponent<
  IPage & RouteComponentProps<any>
> = ({ name }) => {
  const [managerProfile, setManagerProfile] = useState<DocumentData | null>(
    null
  );

  // TODO: temp disable eslint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const { currentUser, accountType } = useAuth();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentUser) {
    return null;
  }

  return (
    <Profiler
      id={name}
      onRender={(
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
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
      }}
    >
      <Container fluid className="all-pages">
        <Tab.Container id="sidebar" defaultActiveKey="profile">
          <Row>
            <Col sm={12} lg={2}>
              <Nav variant="pills" className="flex-column side-nav">
                <Nav.Item>
                  <Nav.Link eventKey="profile" className="tab">
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="update" className="tab">
                    Edit Profile
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={12} lg={9} className="p-0">
              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <Profile
                    jobTitle={managerProfile?.jobTitle}
                    companyName={managerProfile?.companyName}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="update">
                  <UpdateProfile
                    jobTitle={managerProfile?.jobTitle}
                    companyName={managerProfile?.companyName}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </Profiler>
  );
};

export default withRouter(ManageProfilePage);
