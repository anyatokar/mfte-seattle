export default interface IBuilding {
  buildingID: string;
  buildingName: string;
  phone: string;
  residentialTargetedArea: string;
  totalRestrictedUnits: number;
  sedu: number;
  studioUnits: number;
  oneBedroomUnits: number;
  twoBedroomUnits: number;
  threePlusBedroomUnits: number;
  urlForBuilding: string;
  lat: number;
  lng: number;
  streetNum: string;
  street: string;
  city: string;
  state: string;
  zip: number;
  note: string
} 
