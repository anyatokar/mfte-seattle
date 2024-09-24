import { Timestamp } from "firebase/firestore";

export type availDataType = {
  micro: number;
  studio: number;
  oneBed: number;
  twoBed: number;
  threePlusBed: number;
};

export default interface IListing {
  isApproved: boolean;
  buildingName: string;
  contactName: string;
  email: string;
  companyName: string;
  url: string;
  message: string;
  availData: availDataType;
  buildingID: string;
  sentTimestamp: Timestamp;
}
