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
        <h1 className="display-5">MFTE Seattle</h1>
        <hr className="my-4"></hr>
        <p className="lead">
          Find modern rent-reduced apartments in Seattle through the Multifamily Tax Exemption program.
        </p>
        <p className="lead">
          This website is unaffiliated with the City of Seattle. Its intention is to help prospective MFTE tenants map the spreadsheet of properties provided by the City.
        </p>
        <ul className="resources-list lead">
          <li>
            <a id="MFTE_homepage"
              href="https://www.seattle.gov/housing/renters/find-housing#multifamilytaxexemptionmfteincentivezoning"
              target="_blank"
              rel="noreferrer">
              City of Seattle MFTE homepage
            </a>
          </li>
          <li>
            <a id="spreadsheet_of_properties: https://www.seattle.gov/Documents/Departments/Housing/HousingDevelopers/MultifamilyTaxExemption/MFTEParticipantContact.pdf"
              href="https://www.seattle.gov/Documents/Departments/Housing/HousingDevelopers/MultifamilyTaxExemption/MFTEParticipantContact.pdf"
              target="_blank"
              rel="noreferrer">
              Spreadsheet of properties
            </a>
          </li>
        </ul>
        <hr className="my-4"></hr>
        <div className="btn-toolbar">
          <Button onClick={onClick} value="./buildings" variant="outline-info" className="btn-lg standalone-btn">View Buildings</Button>
          <Button onClick={onClick} value="./about" variant="outline-info" className="btn-lg standalone-btn">About MFTE</Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage;