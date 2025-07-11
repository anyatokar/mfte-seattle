import { Address, AmiData, Contact } from "../interfaces/IBuilding";
import { OptionalUrls, UnitAvailData } from "../interfaces/IListing";
import { CurrentBuildingData } from "../interfaces/ITempBuilding";
import { EditListingFormFields } from "../types/editListingFormFieldsType";
import { BedroomsKeyEnum, OptionalUrlsKeyEnum } from "../types/enumTypes";
import { PartialWithRequired } from "../types/partialWithRequiredType";

const blankOptionalUrls: OptionalUrls = {
  [OptionalUrlsKeyEnum.listingPageUrl]: "",
  [OptionalUrlsKeyEnum.walkTourUrl]: "",
  [OptionalUrlsKeyEnum.floorPlanUrl]: "",
  [OptionalUrlsKeyEnum.otherUrl1]: "",
  [OptionalUrlsKeyEnum.otherUrl2]: "",
};

export const createBlankAvailRow = (): UnitAvailData => ({
  unitSize: undefined,
  dateAvailString: "",
  percentAmi: undefined,
  maxRent: "",
  rowId: `${Date.now()}`,
  aptNum: "",
  selectedProgram: undefined,
  optionalUrls: blankOptionalUrls,
});

const emptyAddressCurrentBuildingData: PartialWithRequired<
  Address,
  "streetAddress" | "zip" | "neighborhood"
> = {
  streetAddress: "",
  zip: "",
  neighborhood: "",
};

const emptyContactCurrentBuildingData: PartialWithRequired<
  Contact,
  "phone" | "urlForBuilding"
> = {
  phone: "",
  urlForBuilding: "",
};

export const createBlankTable = (): AmiData => ({
  [BedroomsKeyEnum.MICRO]: [],
  [BedroomsKeyEnum.STUDIO]: [],
  [BedroomsKeyEnum.ONE_BED]: [],
  [BedroomsKeyEnum.TWO_BED]: [],
  [BedroomsKeyEnum.THREE_PLUS]: [],
});

export const emptyCurrentBuildingData: CurrentBuildingData = {
  buildingName: "",
  buildingID: "",
  address: emptyAddressCurrentBuildingData,
  contact: emptyContactCurrentBuildingData,
  amiData: createBlankTable(),
};

export const createEmptyFormFields = (): EditListingFormFields => ({
  buildingName: "",
  buildingID: "",
  availDataArray: [createBlankAvailRow()],
  url: "",
  expiryDate: "",
  description: "",
  feedback: "",
  noneAvailable: false,
});
