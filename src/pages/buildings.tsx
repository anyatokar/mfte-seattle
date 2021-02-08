import React, { useEffect, useState, useCallback } from 'react';
import IPage from '../interfaces/page';
// import logging from '../config/logging';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Map from "../Map/Map";
import { loadMapApi } from "../utils/GoogleMapsUtils";
import firebase from '../db/firebase';
import 'firebase/firestore';


import Sorters from "../components/Sorters";
import SearchInput from "../components/SearchInput";
import { BuildingCard } from "../components/BuildingCard";
import IBuilding from "../interfaces/IBuilding";
// import buildings from "../db/buildings";
import { genericSort } from "../utils/genericSort";
import { genericSearch } from "../utils/genericSearch";
import { genericFilter } from "../utils/genericFilter";
import { Filters } from "../components/Filters";
import IFilter from "../interfaces/IFilter";
import ISorter from "../interfaces/ISorter";


const ref = firebase.firestore().collection("buildings"); 

const BuildingsPage: React.FunctionComponent<IPage & RouteComponentProps<any>> = props => {

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [buildings, setBuildings] = useState([] as Array<IBuilding>);
  // const [infoWindownContent, setInfoWindowContent] = useState('');

  // const [buildings, setBuildings] = useState([] as any);
// const [loading, setLoading] = useState(false);


const getBuildings = useCallback(() => {   
  ref.onSnapshot((querySnapshot) => {
  const items: Array<IBuilding> = [];
  querySnapshot.forEach((doc) => {
    items.push(doc.data() as IBuilding);
    // console.log(doc.data())
  });
  setBuildings(items)
  // setLoading(false)
});
}, []) 


useEffect(() => {
  getBuildings(); 
}, [getBuildings]); 

  useEffect(() => {
    const googleMapScript = loadMapApi();
    googleMapScript.addEventListener('load', function () {
      setScriptLoaded(true);
      // console.log('code is running!!!!!')
    });
  }, []);

  const [query, setQuery] = useState<string>("");
  const [activeSorter, setActiveSorter] = useState<ISorter<IBuilding>>({
    property: "buildingName",
    isDescending: false,
  });
  const [activeFilters, setActiveFilters] = useState<Array<IFilter<IBuilding>>>(
    []
  );

  const resultBuildings = buildings
    .filter((building) =>
      genericSearch<IBuilding>(building, ["buildingName", "residentialTargetedArea", "streetNum", "street", "zip"], query)
    )
    .filter((building) => genericFilter<IBuilding>(building, activeFilters))
    .sort((buildingA, buildingB) =>
      genericSort<IBuilding>(buildingA, buildingB, activeSorter)
    );


  // const [message, setMessage] = useState<string>('');

  // useEffect(() => {
  //   logging.info(`Loading ${props.name}`);

  //   let number = props.match.params.number;

  //   if (number)
  //   {
  //     setMessage(`The Number is ${number}`);
  //   }
  //   else
  //   {
  //     setMessage(`No number provided!`);
  //   }
  // }, [props])

  return (
    <div>
      {/* search sort filter container */}
      <div className="container mx-auto my-2">
        {/* search */}
        <SearchInput onChangeSearchQuery={(query) => setQuery(query)} />
        {/* filter */}
        {buildings.length > 0 && <Filters<IBuilding>
          object={buildings[0]}
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
        />}
      </div>

      <section className="container-fluid">
        <div className="row">
        <div className="col-lg-4">
      <h3>Results:</h3>


              {/* sort */}
              {buildings.length > 0 && <Sorters<IBuilding>
        
        object={buildings[0]}
        onChangeSorter={(property, isDescending) => {
          setActiveSorter({
            property,
            isDescending,
          });
        }}
      />}
      </div>
      </div>
      </section>


      <section className="container-fluid">
        <div className="row">


      {/* building list */}
      {/* <div className="container mx-auto my-2"> */}
          <div className="col-lg-4 col-med-12 mx-auto my-2 overflow-auto buildings-list">

            {resultBuildings.length > 0 && (
              <div>
                {resultBuildings.map((building) => (
                  <BuildingCard key={building.buildingName} {...building} />
                ))}
              </div>
            )}
            {resultBuildings.length === 0 && <p>No results found!</p>}
            {/* <p>{message}</p>
            <Link to="/">Go to the home page!</Link> */}
          </div>
                {/* map */}
          <div className="col">
            {scriptLoaded && (
              <Map
                mapType={google.maps.MapTypeId.ROADMAP}
                mapTypeControl={true}
                filteredBuildings={resultBuildings}
              />
            )}
          </div>
        </div>
      </section>
    </div>

  );
}

export default withRouter(BuildingsPage);