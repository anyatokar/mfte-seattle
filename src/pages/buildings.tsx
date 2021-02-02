import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { BuildingsTable } from "../components/buildingsTable"
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";


import Sorters from "../components/Sorters";
import SearchInput from "../components/SearchInput";
import { WidgetCard } from "../components/WidgetCard";
import IWidget from "../interfaces/IWidget";
import widgets from "../db/widgets";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";

const AboutPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
    });
  }, []);

  const [query, setQuery] = useState<string>("");
  const [activeSorter, setActiveSorter] = useState<ISorter<IWidget>>({
    property: "buildingName",
    isDescending: false,
  });
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IWidget>>>(
    []
  );

  const resultWidgets = widgets
    .filter((widget) =>
      genericSearch<IWidget>(widget, ["buildingName", "residentialTargetedArea", "number", "street", "zip"], query)
    )
    .filter((widget) => genericFilter<IWidget>(widget, activeFilters))
    .sort((widgetA, widgetB) =>
      genericSort<IWidget>(widgetA, widgetB, activeSorter)
    );


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
      {/* search sort filter container */}
      <div className="container mx-auto my-2">
        {/* search */}
        <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
        {/* sort */}
        <Sorters<IWidget>
          object={widgets[0]}
          onChangeSorter={(property, isDescending) => {
            setActiveSorter({
              property,
              isDescending,
            });
          }}
        />
        {/* filter */}
        <Filters<IWidget>
          object={widgets[0]}
          filters={activeFilters}
          onChangeFilter={(changedFilterProperty, checked, isTruthyPicked) => {
            checked
              ? setActiveFilters([
                  ...activeFilters.filter(
                    (filter) => filter.property !== changedFilterProperty
                  ),
                  { property: changedFilterProperty, isTruthyPicked },
                ])
              : setActiveFilters(
                  activeFilters.filter(
                    (filter) => filter.property !== changedFilterProperty
                  )
                );
          }}
        />
      </div>

      {/* map */}
      <div>
        {scriptLoaded && (
          <Map
            mapType={google.maps.MapTypeId.ROADMAP}
            mapTypeControl={true}
          />
        )}
      </div>

      {/* building list */}
      <div className="container mx-auto my-2">
        <h3>Search results:</h3>
        {resultWidgets.length > 0 && (
          <div className="row">
            {resultWidgets.map((widget) => (
              <WidgetCard key={widget.buildingName} {...widget} />
            ))}
          </div>
        )}
        {resultWidgets.length === 0 && <p>No results found!</p>}
        {/* <p>{message}</p>
        <Link to="/">Go to the home page!</Link> */}
      </div>
    </div>
  );
}

export default withRouter(AboutPage);