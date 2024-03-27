import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import privacyPolicyHtml from "../termly/privacy-policy";

const PrivacyPolicyPage = () => {
  return (
    <Container className="all-pages diy-jumbotron">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="scrollable-card p-4">
            <div dangerouslySetInnerHTML={{ __html: privacyPolicyHtml }} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default PrivacyPolicyPage;
