import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Container} from "react-bootstrap";

const ResourcesPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <Container className="diy-jumbotron">
      <h1 className="display-5">Resources</h1>
      <hr className="my-4"></hr>
      <p className="lead">
        From the Seattle Office of Housing:
      </p>
      <ul className="resources-list lead">
        <li>
          <a id="mfte-city-website"
            href="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
            title="Information about the MFTE program and other income and rent restricted properties on the City of Seattle website"
            target="_blank"
            rel="noreferrer">
            Main Resources Page
          </a>
        </li>
        <li>
          <a id="properties-spreadsheet-may-2023"
            href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
            title="Market-Rate Rental Properties with Affordable Housing Units spreadsheet by the City of Seattle - November 2023 update - PDF"
            target="_blank"
            rel="noreferrer">
            MFTE Spreadsheet of Properties (November 2023)
          </a>
        </li>
        <li>
          <a id="income-and-rent-limits"
            href="https://www.seattle.gov/documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2023_Income_Rent_Limits_Rental.pdf"
            title="Income and Rent Limits, effective May 15, 2023 - PDF"
            target="_blank"
            rel="noreferrer">
            Income and Rent Limits (FY 2023)
          </a>
        </li>
        <li>
          <a id="renters-guide"
            href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Renters_Guide_7-2023.pdf"
            title="Renters' Guide for Market-Rate Apartment Buildings with Affordable Units - July 2023 - PDF"
            target="_blank"
            rel="noreferrer">
            Detailed Renter's Guide (July 2023)
          </a>
        </li>
        <li>
          <a id="mfte-faqs"
            href="https://www.seattle.gov/Documents/Departments/Housing/Renters/MFTE%20FAQ.pdf"
            title="Two-page overview of the MFTE program. Note the map and income limits are outdated - 2018"
            target="_blank"
            rel="noreferrer">
            MFTE FAQs (2018)
          </a>
        </li>
      </ul>
    </Container>
  )
}

export default withRouter(ResourcesPage);
