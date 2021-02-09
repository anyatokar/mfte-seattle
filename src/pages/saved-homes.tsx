import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';

const SavedHomesPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <div>
      Your saved homes.

    </div>
  )
}

export default withRouter(SavedHomesPage);