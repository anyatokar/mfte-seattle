import { Timestamp } from "firebase/firestore";
import {
  BedroomsKeyEnum,
  listingStatusEnum,
  OptionalUrlsKeyEnum,
  ProgramKeyEnum,
} from "../types/enumTypes";
import { Address, AmiData, Contact, PercentAmi } from "./IBuilding";
import { PartialWithRequired } from "../types/partialWithRequiredType";

export type ListingWithRequired = PartialWithRequired<
  IListing,
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "listingID"
  | "buildingID"
  | "description"
  | "feedback"
>;

export type PartialAddress = PartialWithRequired<
  Address,
  "streetAddress" | "zip" | "neighborhood"
>;

export type PartialContact = PartialWithRequired<
  Contact,
  "phone" | "urlForBuilding"
>;

export type CurrentBuildingData = {
  buildingName: string;
  buildingID: string;
  address: PartialAddress;
  contact: PartialContact;
  amiData: AmiData;
  otherBuildingName?: string;
};

export type UnitAvailData = {
  unitSize: BedroomsKeyEnum | undefined;
  /** This is a string because it is always a date in Pacific Time, no matter where the user is located. Think of it as move in date */
  dateAvailString: string;
  /** String when in form, gets converted to number before sent to Firestore */
  maxRent: string | number;
  percentAmi: PercentAmi | undefined;
  rowId: string;
  aptNum: string;
  selectedProgram: ProgramKeyEnum | undefined;
  optionalUrls: OptionalUrls;
  otherProgram?: string;
};

export type AvailDataArray = UnitAvailData[];

export type OptionalUrls = { [key in OptionalUrlsKeyEnum]?: string };

export default interface IListing {
  listingID: string;
  listingStatus: listingStatusEnum | undefined;
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
  noneAvailable: boolean;
}
