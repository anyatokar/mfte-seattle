import { Timestamp } from "firebase/firestore";
import { BedroomsKeyEnum, listingStatusEnum } from "../types/enumTypes";

export type AvailData = {
  [key in BedroomsKeyEnum]: {
    /** String when in form, gets converted to number before sent to Firestore */
    numAvail: string | number;
    /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
    dateAvailString: string;
    /** String when in form, gets converted to number before sent to Firestore */
    maxRent: string | number;
    percentAmi: string;
  };
};

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum;
  buildingName: string;
  url: string;
  description: string;
  availData: AvailData[];
  buildingID: string;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  expiryDate: string;
  managerID: string;
}
