import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  // const [query, setQuery] = useState<string>("");

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-5">About</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          MFTE Simple is intended to help people find safe and comfortable rent-reduced housing in Seattle. It focuses on the MFTE (Multifamily Tax Exemption) program because of the relatively quick application turnaround, high availability, and desirable buildings and locations.
        </p>
        <p className="lead">
          All data is sourced from the list of properties participating in the MFTE and Incentive Zoning programs most recently updated by the City of Seattle Office of Housing on 12/31/2020. 
        </p>
        <p className="lead">
          <strong>Resources from the Seattle Office of Housing: </strong>
        </p>
        <ul className="helpful-links">
          <li>
            <a id="myLink" 
              href="https://www.seattle.gov/Documents/Departments/Housing/HousingDevelopers/MultifamilyTaxExemption/MFTEParticipantContact.pdf" 
              target="_blank" 
              rel="noreferrer">
              List of Properties
            </a>
          </li>
          <li>
            <a id="myLink" 
              href="https://www.seattle.gov/housing/renters/find-housing#multifamilytaxexemptionmfteincentivezoning" 
              target="_blank" 
              rel="noreferrer">
              Main Resources Page
            </a>
          </li>
          <li>
            <a id="myLink" 
              href="http://www.seattle.gov/Documents/Departments/Housing/PropertyManagers/IncomeRentLimits/2019%20MFTE%20Income%20Limits.pdf" 
              target="_blank" 
              rel="noreferrer">
              Income and Rent Limits
            </a>
          </li>
          <li>
            <a id="myLink" 
              href="https://www.seattle.gov/Documents/Departments/Housing/Renters/MFTE%20FAQ.pdf" 
              target="_blank" 
              rel="noreferrer">
              MFTE FAQs
            </a>
          </li>
          <li>
            <a id="myLink" 
              href="https://www.seattle.gov/Documents/Departments/Housing/Renters/MFTE.IZ.RentersGuide.pdf" 
              target="_blank" 
              rel="noreferrer">
              Detailed Rent's Guide
            </a>
          </li>   
        </ul>
      </div>
    </div>
  )
}

export default withRouter(AboutPage);