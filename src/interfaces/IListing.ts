import { Timestamp } from "firebase/firestore";

type unitSizeType = "micro" | "studio" | "oneBed" | "twoBed" | "threePlusBed";

export type availDataType = {
  unitSize: unitSizeType;
  numAvail: number;
  dateAvail: Timestamp | null;
};

export default interface IListing {
  isApproved: boolean;
  buildingName: string;
  contactName: string;
  email: string;
  companyName: string;
  url: string;
  message: string;
  /** This is an array to keep the order from smallest to largest on render. */
  availData: availDataType[];
  buildingID: string;
  sentTimestamp: Timestamp;
}
