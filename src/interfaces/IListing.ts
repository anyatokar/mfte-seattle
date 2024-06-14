import { Timestamp } from "firebase/firestore";

export default interface IListing {
  name: string;
  address: string;
  url: string;
  startDate: string;
  endDate: string;
  lastUpdateDate: string;
  hasAnyAvailability: boolean;
  listingId: string;
  buildingID: string;
  seduRent: string;
  studioRent: string;
  oneBedRent: string;
  twoBedRent: string;
  threePlusBedRent: string;
  dateSeduAvailable: Timestamp;
  dateStudioAvailable: Timestamp;
  dateOneBedAvailable: Timestamp;
  dateTwoBedAvailable: Timestamp;
  dateThreePlusBedAvailable: Timestamp;
}
