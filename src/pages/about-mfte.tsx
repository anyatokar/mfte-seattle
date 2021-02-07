import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const AboutMFTEPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  // const [query, setQuery] = useState<string>("");

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-4">About Multifamily Tax Exemption Program</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          This is placeholder text. I want this page to have more advice and information that's important to know such as income restrictions. 
        </p>
        <p className="lead">
          There are more than 4,000 units in over 250 apartment buildings in Seattle are rent-restricted through the Multifamily Tax Exemption Program and/or Incentive Zoning. These units are available to low to moderate income households, with specific income requirements dependent on the size of the household and the number of bedrooms. Each building's property management team handles the income certification and leasing process. Inquiries about current vacancies and the application process should be directed to the property.
        </p>
        <p className="lead">
          Prospective tenants wishing to apply for an income/rent restricted unit in a project participating in the MFTE and/or IZ programs, must apply and get income certified at the participating property. It is the responsibility of the property to income qualify prospective tenants for the program.  
        </p>
      </div>
    </div>
  )
}

export default withRouter(AboutMFTEPage);