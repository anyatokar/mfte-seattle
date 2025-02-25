import { Timestamp } from "firebase/firestore";
import {
  BedroomsKeyEnum,
  listingStatusEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";

export type UnitAvailData = {
  unitSize: BedroomsKeyEnum | undefined;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  dateAvailString: string;
  /** String when in form, gets converted to number before sent to Firestore */
  maxRent: string | number;
  percentAmi: string;
  rowId: string;
};

export type AvailDataArray = UnitAvailData[];

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum;
  buildingName: string;
  url: string;
  description: string;
  availDataArray: AvailDataArray;
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
  managerID: string;
  feedback: string;
  program: ProgramKeyEnum | undefined;
}
