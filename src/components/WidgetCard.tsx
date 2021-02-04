import * as React from "react";
import Moment from "react-moment";
import IWidget from "../interfaces/IWidget";

export function WidgetCard(props: IWidget) {
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
    number,
    street, 
    city,
    state, 
    zip,
  } = props;
  return (
    <div className="col-12 p-3">
      <div>
        <div className="card-body">
          <h1 className="card-title">{buildingName}</h1>
          <p className="card-text">Neighborhood: {residentialTargetedArea}</p>
          <p className="card-text">Address: {number} {street}, {city}, {state} {zip}</p>
          <p className="card-text">Total Resticted Units: {totalRestrictedUnits}</p>
          <p className="card-text font-italic">Studios: {studioUnits}</p>
          <p className="card-text font-italic">One bedrooms: {oneBedroomUnits}</p>
          <p className="card-text font-italic">Two bedrooms: {twoBedroomUnits}</p>
          <p className="card-text font-italic">Three+ bedrooms: {threePlusBedroomUnits}</p>
        </div>
        <div className="card-footer text-muted text-right">
          <span className="float-left">{<a href={urlforBuilding}>{urlforBuilding}</a>}</span> Phone number: {phone}
        </div>
      </div>
    </div>
  );
}