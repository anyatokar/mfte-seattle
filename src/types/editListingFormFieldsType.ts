import IListing from "../interfaces/IListing";
import { PartialWithRequired } from "./partialWithRequiredType";

export type EditListingFormFields = PartialWithRequired<
  IListing,
  | "buildingName"
  | "buildingID"
  | "availDataArray"
  | "url"
  | "expiryDate"
  | "description"
  | "feedback"
  | "noneAvailable"
>;
