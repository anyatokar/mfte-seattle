import IBuilding from "./IBuilding"

// stealing from map.d.ts because I can't figure out how to import the type
export enum MapTypeId {
  /** This map type displays a transparent layer of major streets on satellite images. */
  HYBRID = 'hybrid',
  /** This map type displays a normal street map. */
  ROADMAP = 'roadmap',
  /** This map type displays satellite images. */
  SATELLITE = 'satellite',
  /** This map type displays maps with physical features such as terrain and vegetation. */
  TERRAIN = 'terrain',
};
export default interface IMap {
  mapType: MapTypeId;
  mapTypeControl?: boolean;
  filteredBuildings: Array<IBuilding>
}

