import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const SavedSearchesPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <>
      <div className="container saved-homes-header">
        <h1 className="display-6">Saved Searches</h1>
        {/* <p className="lead"></p> */}
        <hr className="my-4"></hr>
      </div>
      {/* <div className="container-fluid">
        <div className="row"></div>
      </div> */}
    </>
  )
}

export default withRouter(SavedSearchesPage);