import { Timestamp } from "firebase/firestore";
import { listingStatusEnum } from "../types/enumTypes";

export type UnitSize =
  | "micro"
  | "studio"
  | "oneBed"
  | "twoBed"
  | "threePlusBed";

export type AvailData = {
  unitSize: UnitSize;
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
  availData: AvailData[];
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
  managerID: string;
}
