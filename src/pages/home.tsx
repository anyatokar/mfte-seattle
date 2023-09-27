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
        <p className="lead">Find modern rent-reduced apartments in Seattle through the Multifamily Tax Exemption program.</p>
        <p className="lead">Use the&nbsp;
          <a id="Buildings_tab"
            href="./Buildings"
            title="View the map of MFTE properties">
            Buildings tab
          </a>&nbsp;to view a map of properties which participate in the MFTE (Multifamily Tax Exemption) program. You can create an account to save properties to your own map and keep notes.
        </p>
        <p className="lead">
          While the property data for this website is sourced from the City of Seattle&nbsp;
          <a id="properties-spreadsheet-may-2023"
            href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
            title="Market-Rate Rental Properties with Affordable Housing Units spreadsheet by the City of Seattle - May 2023 update - PDF"
            target="_blank"
            rel="noreferrer">
            property spreadsheet
          </a>,&nbsp;this website is not affiliated with the City. Please refer to the&nbsp;
          <a id="mfte-city-website"
            href="https://www.seattle.gov/housing/renters/find-housing#affordableapartmentsinmarketratebuildings"
            title="Information about the MFTE program and other income and rent restricted properties on the City of Seattle website"
            target="_blank"
            rel="noreferrer">
            government site
          </a>&nbsp;for complete information on MFTE including current income and rent limits.
        </p>
        <hr className="my-4"></hr>
        <div className="btn-toolbar">
          <Button onClick={onClick} value="./buildings" variant="outline-info" className="btn-lg standalone-btn">View Buildings</Button>
          <Button onClick={onClick} value="./about" variant="outline-info" className="btn-lg standalone-btn">About MFTE Seattle</Button>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
