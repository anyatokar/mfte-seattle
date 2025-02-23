import { Timestamp } from "firebase/firestore";
import { BedroomsKeyEnum, listingStatusEnum } from "../types/enumTypes";

export type UnitAvailData = {
  unitSize: BedroomsKeyEnum | undefined;
  /** String when in form, gets converted to number before sent to Firestore */
  numAvail: string | number;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  dateAvailString: string;
  /** String when in form, gets converted to number before sent to Firestore */
  maxRent: string | number;
  percentAmi: string;
};

export type AvailDataArray = UnitAvailData[];

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum;
  buildingName: string;
  url: string;
  description: string;
  /** This is an array to keep the order from smallest to largest on render. */
  availDataArray: AvailDataArray;
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
  managerID: string;
  feedback: string;
  program: "P345" | "P6" | undefined;
}
