export default interface IBuilding {
  buildingID: string;
  buildingName: string;
  phone: string;
  phone2: string;
  residentialTargetedArea: string;
  totalRestrictedUnits: 0 | string;
  sedu: 0 | string;
  studioUnits: 0 | string;
  oneBedroomUnits: 0 | string;
  twoBedroomUnits: 0 | string;
  threePlusBedroomUnits: 0 | string;
  urlForBuilding: string;
  lat: number;
  lng: number;
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}
