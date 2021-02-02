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



  const [query, setQuery] = useState<string>("");
  const [activeSorter, setActiveSorter] = useState<ISorter<IWidget>>({
    property: "buildingName",
    isDescending: true,
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


    <div className="container mx-auto my-2">
    <div className="my-3">
      {/* <i>
        From the blog post{" "}
        <a href="https://chrisfrewin.com/blog/react-typescript-generic-search-sort-and-filters/">
          "React and TypeScript: Generic Search, Sorters, and Filters"
        </a>
        .
      </i> */}
    </div>
    
    <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
    <Sorters<IWidget>
      object={widgets[0]}
      onChangeSorter={(property, isDescending) => {
        setActiveSorter({
          property,
          isDescending,
        });
      }}
    />
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

    




  <section className="col">
          < BuildingsTable />
        </section>
    <div className="wrapper container">








      <div className="row">

        <section className="col">
          <h3>Results:</h3>
          {resultWidgets.length > 0 && (
            <div className="row">
              {resultWidgets.map((widget) => (
                <WidgetCard key={widget.buildingName} {...widget} />
              ))}
            </div>
          )}
          {resultWidgets.length === 0 && <p>No results found!</p>}
        </section>
        

      </div>



      <p>{message}</p>
      <Link to="/">Go to the home page!</Link>
    </div>
    </div>
  );
}

export default withRouter(AboutPage);