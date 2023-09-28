import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-5">About</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          The purpose of this website is to help people in their search for safe and comfortable rent-reduced housing. It aims to supplement existing government resources by mapping all MFTE (Multifamily Tax Exemption) properties, with the option to search and filter for apartments that fit given criteria (e.g. number of bedrooms, neighborhood, building name). To keep a shortlist of properties, users can create a (free) login to view a personalized map and add notes.
        </p>
        <p className="lead">
          We chose to highlight the MFTE program because of the relatively quick application turnaround, higher availability, and modern apartments in sought-after locations. However, MFTE is not the only rent-reduced program, and it's not available to everyone. Please view official government resources for complete information on rent-reduced and affordable housing programs in Seattle.
        </p>
        <p className="lead">Buildings shown on&nbsp;
          <a id="Buildings_tab"
            href="./Buildings"
            title="View the map of MFTE properties">
            the map
          </a>&nbsp;are sourced from the spreadsheet of&nbsp;
          <a id="properties-spreadsheet-may-2023"
            href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
            title="Market-Rate Rental Properties with Affordable Housing Units spreadsheet by the City of Seattle - May 2023 update - PDF"
            target="_blank"
            rel="noreferrer">
            Market-Rate Rental Properties with Affordable Housing Units Regulated by the City of Seattle (May 2023)
          </a>.
        </p>
        <p className="lead">
          <strong>Additional resources from the Seattle Office of Housing:</strong>
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
        <hr className="my-4"></hr>
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
      </div>
    </div>
  )
}

export default withRouter(AboutPage);
