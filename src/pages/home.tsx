import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap"

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  const history = useHistory()

  // const [query, setQuery] = useState<string>("");
  function onClick(e: any) {
    e.preventDefault()
    history.push(e.target.value)
  };

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-5">MFTE Simple</h1>
        <p className="lead">
          Find modern rent-reduced apartments in Seattle through the Multifamily Tax Exemption Program.
        </p>
        <hr className="my-4"></hr>
        <p className="lead">
        
        </p>
        <div className="btn-toolbar">
          <Button onClick={onClick} value="./buildings" variant="outline-info" className="btn-lg standalone-btn">View Buildings</Button>
          <Button onClick={onClick} value="./about" variant="outline-info" className="btn-lg standalone-btn">About MFTE</Button>
          {/* <a className="btn btn-outline-info btn-lg standalone-btn" href="./buildings" role="button">View Buildings</a>
          <a className="btn btn-outline-info btn-lg standalone-btn" href="./about" role="button">About MFTE</a> */}
        </div>
      </div>
    </div>
  )
}

export default HomePage;