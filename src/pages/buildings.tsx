import React, { useEffect, useState } from 'react';
import IPage from '../types/page';
import logging from '../config/logging';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { BuildingsTable } from "../components/buildingsTable"
import Map from "../api/Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    });
  }, []);

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    logging.info(`Loading ${props.name}`);

    let number = props.match.params.number;

    if (number)
    {
      setMessage(`The Number is ${number}`);
    }
    else
    {
      setMessage(`No number provided!`);
    }
  }, [props])

  return (
    <div>
      <div>
        {scriptLoaded && (
          <Map
            mapType={google.maps.MapTypeId.ROADMAP}
            mapTypeControl={true}
          />
        )}
      </div>

      < BuildingsTable />
      <p>{message}</p>
      <Link to="/">Go to the home page!</Link>
    </div>
  );
}

export default withRouter(AboutPage);