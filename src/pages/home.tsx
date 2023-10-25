import React, { useEffect } from 'react';
import IPage from '../interfaces/IPage';
import logging from '../config/logging';
import { useHistory } from "react-router-dom";
import { Button, Container, Stack } from "react-bootstrap"

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  const history = useHistory()

  function onClick(event: any) {
    event.preventDefault()
    history.push(event.target.value)
  };

  return (
    <Container className="diy-jumbotron">
      <h1 className="display-5">MFTE Seattle</h1>
      <hr className="my-4"></hr>
      <p className="lead">Find modern rent-reduced apartments in Seattle through the Multifamily Tax Exemption (MFTE) program.</p>
      <p className="lead">Use the&nbsp;
        <a id="Buildings_tab"
          href="./Buildings"
          title="View the map of MFTE properties">
          MFTE Map
        </a>&nbsp;tab to view participating buildings. Create an account to save buildings and keep notes.
      </p>
      <p className="lead">
        While the property data for this website is sourced from the City of Seattle&nbsp;
        <a id="properties-spreadsheet-may-2023"
          href="https://www.seattle.gov/documents/Departments/Housing/Renters/Incentive_Programs_Affordable_Housing_List.pdf"
          title="Market-Rate Rental Properties with Affordable Housing Units spreadsheet by the City of Seattle - November 2023 update - PDF"
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
      <p className="lead"> Contact buildings directly for current availability.</p>
      <hr className="my-4"></hr>
      <Stack gap={3} >
        <Button
          className="btn-lg col-lg-4 col-xl-3"
          variant="outline-info"
          onClick={onClick}
          value="./buildings">
          View Buildings Map
        </Button>
        <Button
          className="btn-lg col-lg-4 col-xl-3"
          variant="outline-info"
          onClick={onClick}
          value="./about">
          About MFTE Seattle
        </Button>
      </Stack>
    </Container>
  )
}

export default HomePage;
