import { Timestamp } from "firebase/firestore";

export default interface IListing {
  isApproved: boolean;
  buildingName: string;
  contactName: string;
  email: string;
  companyName: string;
  url: string;
  message: string;
  microNumAvail: number;
  studioNumAvail: number;
  oneBedNumAvail: number;
  twoBedNumAvail: number;
  threePlusBedNumAvail: number;
  buildingID: string;
  sentTimestamp: Timestamp;
}
