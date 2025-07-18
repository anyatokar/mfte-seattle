import { AmiData } from "./IBuilding";
import { PartialAddress, PartialContact } from "./IListing";

export type CurrentBuildingData = {
  buildingName: string;
  buildingID: string;
  address: PartialAddress;
  contact: PartialContact;
  amiData: AmiData;
  isAgeRestricted: boolean;
  isEnding: boolean;
  otherBuildingName?: string;
  wasDeleted?: boolean;
};

export interface ITempBuilding extends CurrentBuildingData {
  listingID: string;
}
