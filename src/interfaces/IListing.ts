import { Timestamp } from "firebase/firestore";
import { listingStatusEnum } from "../types/enumTypes";

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
  listingStatus: listingStatusEnum;
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
