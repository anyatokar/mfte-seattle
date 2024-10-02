import { Timestamp } from "firebase/firestore";

export type unitSizeType =
  | "micro"
  | "studio"
  | "oneBed"
  | "twoBed"
  | "threePlusBed";

export type availDataType = {
  unitSize: unitSizeType;
  numAvail: number;
  dateAvail: Timestamp | null;
};

export default interface IListing {
  listingID: string;
  isApproved: boolean;
  buildingName: string;
  contactName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  url: string;
  message: string;
  /** This is an array to keep the order from smallest to largest on render. */
  availData: availDataType[];
  buildingID: string;
  sentTimestamp: Timestamp;
}
