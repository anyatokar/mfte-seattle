import React, { useEffect } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  // const [query, setQuery] = useState<string>("");

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-4">MFTE Simple</h1>
        <p className="lead">
          Find safe, comfortable, and affordable apartments for rent in Seattle.
        </p>
        <hr className="my-4"></hr>
        <p className="lead">
        
        </p>
        <div className="btn-toolbar">
          <a className="btn btn-outline-info btn-lg standalone-btn" href="./buildings" role="button">View Buildings</a>
          <a className="btn btn-outline-info btn-lg standalone-btn" href="./about-mfte" role="button">About MFTE</a>
        </div>
      </div>
    </div>
  )
}

export default HomePage;