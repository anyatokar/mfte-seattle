import IBuilding from "./IBuilding"

export default interface IMap {
  mapType: google.maps.MapTypeId;
  mapTypeControl?: boolean;
  filteredBuildings: Array<IBuilding>
}

