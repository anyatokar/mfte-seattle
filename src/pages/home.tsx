import React, { useEffect, useState } from 'react';
import IPage from '../interfaces/page';
import logging from '../config/logging';
import seattle from '../assets/images/seattle.jpg';
import SearchInput from "../components/SearchInput";
import { genericSearch } from "../utils/genericSearch";

const HomePage: React.FunctionComponent<IPage> = props => {
  useEffect(() => {
    logging.info(`Loading ${props.name}`);
  }, [props.name])

  const [query, setQuery] = useState<string>("");

  return (
    <div className="jumbotron">
      <div className="container">
        <h1 className="display-4">MFTE Simple</h1>
        <p className="lead">
          Find safe, comfortable, and affordable apartments for rent in Seattle.
        </p>
        {/* <hr className="my-4"></hr> */}
        <p className="lead">
          <a className="btn btn-primary btn-lg" href="#" role="button">Search Buildings</a>
          <a className="btn btn-primary btn-lg" href="#" role="button">About MFTE</a>
        </p>
      </div>
    </div>

    // <section className="text-center slogan">
    //   {/* <div className="container">
    //     <div className="row">
    //       <div className="col"></div>
    //         <div className="col-9"> */}
    //           <p>
    //             Find safe, comfortable, and affordable apartments for rent in Seattle.
    //           </p>
    //           {/* <p>
    //             It focuses on the MFTE (Multifamily Tax Exemption) program because of the relatively quick application turnaround, high availability, and desirable buildings and locations of homes.
    //           </p>
    //           <p>
    //             All data is sourced from the list of properties participating in the MFTE and Incentive Zoning programs most recently updated by the City of Seattle Office of Housing on 12/31/2020.
    //           </p> */}
    //         {/* </div>
    //         <div className="col"></div>
    //       </div>
    //     </div> */}
    //   <div className="wrapper">
    //   {/* <img className="img-fluid" src={seattle} alt="Seattle skyline" /> */}
    // </div>
    // </section>
  )
}

export default HomePage;