import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

interface PolicyPageWrapperProps {
  policyHtml: string;
}

const PolicyPageWrapper = ({ policyHtml }: PolicyPageWrapperProps) => {
  return (
    <Container className="all-pages diy-jumbotron">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="scrollable-card-policy p-4">
            <div dangerouslySetInnerHTML={{ __html: policyHtml }} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PolicyPageWrapper;
