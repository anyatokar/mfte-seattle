import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const AboutAppPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  // const [query, setQuery] = useState<string>("");

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-4">About this App</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          MFTE Simple is intended to help people find safe, comfortable, and affordable housing for rent in Seattle. It focuses on the MFTE (Multifamily Tax Exemption) program because of the relatively quick application turnaround, high availability, and desirable buildings and locations of homes.
        </p>
        <p className="lead">
          All data is sourced from the list of properties participating in the MFTE and Incentive Zoning programs most recently updated by the City of Seattle Office of Housing on 12/31/2020. 
        </p>
      </div>
    </div>
  )
}

export default withRouter(AboutAppPage);