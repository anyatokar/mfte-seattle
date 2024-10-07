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
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  dateAvail: string;
};

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum;
  buildingName: string;
  url: string;
  message: string;
  /** This is an array to keep the order from smallest to largest on render. */
  availData: availDataType[];
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
}
