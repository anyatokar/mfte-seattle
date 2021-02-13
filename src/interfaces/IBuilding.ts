export default interface IBuilding {
  buildingID: string;
  buildingName: string;
  phone: string;
  residentialTargetedArea: string;
  totalRestrictedUnits: number;
  studioUnits: number;
  oneBedroomUnits: number;
  twoBedroomUnits: number;
  threePlusBedroomUnits: number;
  urlforBuilding: string;
  lat: number;
  lng: number;
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: number;
}
