import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import seattle from '../assets/images/seattle.jpg';

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  return (
    <div className="container">
      <img src={seattle} alt="seattle" />
    </div>

  )
}

export default HomePage;