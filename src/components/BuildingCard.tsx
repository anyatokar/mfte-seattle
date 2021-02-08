import * as React from "react";
import Iframe from 'react-iframe'
// import Moment from "react-moment";
import IBuilding from "../interfaces/IBuilding";

export function BuildingCard(props: IBuilding) {
  const {
    buildingName,
    phone,
    residentialTargetedArea,
    totalRestrictedUnits,
    studioUnits,
    oneBedroomUnits, 
    twoBedroomUnits,
    threePlusBedroomUnits,
    urlforBuilding,
    streetNum,
    street, 
    city,
    state, 
    zip,
  } = props;
  return (
    <div>
      <div>
        <div className="card-body">
          <h4 className="card-title">{<a href={urlforBuilding}>{buildingName}</a>}</h4>
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <div className="card-text"> 
                <h6 className="card-title">{residentialTargetedArea}</h6>
                  <text>{streetNum} {street}</text>
                  <br></br>
                  <p>Seattle, {state} {zip}</p>
                  <p>{phone}</p>
                </div>
              </div>

              <div className="col">
                <h6> Total MFTE Units: {totalRestrictedUnits}</h6>
                  <text> Studios: {studioUnits}</text>
                  <br></br>
                  <text>One bedrooms: {oneBedroomUnits}</text>
                  <br></br>
                  <text>Two bedrooms: {twoBedroomUnits}</text>
                  <br></br>
                  <text>Three+ bedrooms: {threePlusBedroomUnits}</text>
              </div>

              <div>
              <a className="btn btn-outline-warning btn-md" href="./about-mfte" role="button">Save to List</a>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer text-muted text-right">
          {/* <span className="float-left">{<a href={urlforBuilding}>{urlforBuilding}</a>}</span>  */}
        </div>
      </div>
    </div>
  );
}