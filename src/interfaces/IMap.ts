import IWidget from "./IWidget"

export default interface IMap {
  mapType: google.maps.MapTypeId;
  mapTypeControl?: boolean;
  buildings: Array<IWidget>
}

