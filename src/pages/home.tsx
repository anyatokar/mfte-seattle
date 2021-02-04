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
        {/* <hr className="my-4"></hr> */}
        <p className="lead">
          {/* <a className="btn btn-primary btn-lg" href="#" role="button">Search Buildings</a>
          <a className="btn btn-primary btn-lg" href="#" role="button">About MFTE</a> */}
        </p>
      </div>
    </div>
  )
}

export default HomePage;