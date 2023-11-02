import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <Container className="all-pages diy-jumbotron">
<Row><Col lg={9}>
      <p className="display-5">About</p>
      <hr className="my-4"></hr>
      <p className="fs-4">Purpose</p>
      <p className="lead">
        The purpose of this website is to help people find safe and comfortable rent-reduced housing. It aims to supplement existing government resources by mapping all buildings that participate in the MFTE (Multifamily Tax Exemption) program.
      </p>
      <p className="lead">
        We chose to highlight the MFTE program because of the relatively quick application turnaround, higher availability, and modern apartments in sought-after locations.
      </p>
      <p className="fs-4">Data Source</p>
      <p className="lead">Buildings shown on&nbsp;
        <a id="Buildings_tab"
          href="./Buildings"
          title="View the map of MFTE properties">
          the map
        </a>&nbsp;are sourced from the spreadsheet of&nbsp;
        <a id="properties-spreadsheet-may-2023"
          href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
          title="Market-Rate Rental Properties with Affordable Housing Units spreadsheet by the City of Seattle - October 2023 update - PDF"
          target="_blank"
          rel="noreferrer">
          Market-Rate Rental Properties with Affordable Housing Units Regulated by the City of Seattle (October 2023)
        </a>.
      </p>
      <p className="fs-4">Use</p>
      <p className="lead">
        Search and filter for apartments that fit your criteria (e.g. number of bedrooms, neighborhood, building name). To keep a short list of properties, create a (free) login to view a personalized list, map and to add notes.      </p>
      <p className="fs-4">Disclaimer</p>
      <p className="lead">
        MFTE is not the only rent-reduced program, and it's not available to everyone. Please view official government resources for complete information on rent-reduced and affordable housing programs in Seattle.
      </p>
      <p className="lead">
        We do not provide insight on current availability in each building or details on renter qualifications. The best way to learn this information is to get in touch with property management.
      </p>
      <p className="fs-4">Ownership</p>
      <p className="lead">This website was created by an&nbsp;
        <a id="ada-website"
          href="https://adadevelopersacademy.org/"
          title="Ada Developers Academy website"
          target="_blank"
          rel="noreferrer">
          Ada Developers Academy
        </a>&nbsp;grad (and former MFTE apartment resident) in 2021 as her capstone. It is an&nbsp;
        <a id="ada-website"
          href="https://github.com/anyatokar/mfte-seattle"
          title="MFTE Seattle GitHub"
          target="_blank"
          rel="noreferrer">
          open source project
        </a>.
      </p>
      <p className="fs-4">Privacy</p>
      <p className="lead">
        We do not share your information with anyone.
      </p>
      </Col></Row>
    </Container>
  )
}

export default withRouter(AboutPage);
