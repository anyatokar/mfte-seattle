export enum TableTypeEnum {
  amiData = "amiData",
  availData = "availData",
}

export enum listingStatusEnum {
  ARCHIVED = "archived",
  ACTIVE = "active",
  IN_REVIEW = "inReview",
  NEEDS_ATTENTION = "needsAttention",
}

export enum expiryBadgeEnum {
  EXPIRED = "expired",
  EXPIRING_SOON = "expiringSoon",
}

export enum accountTypeEnum {
  RENTER = "renter",
  MANAGER = "manager",
  /** This was created for deleting account - when user has to log in again due to timeout */
  GHOST = "ghost",
  /** Not logged in, created for restricting private routes */
  GUEST = "guest",
}

export enum confirmModalTypeEnum {
  LISTING_DELETE = "listingDelete",
  LISTING_CANCEL_EDIT = "listingCancelEdit",
  ACCOUNT_DELETE = "accountDelete",
}

// Bedrooms
export enum BedroomsKeyEnum {
  MICRO = "micro",
  STUDIO = "studio",
  ONE_BED = "oneBed",
  TWO_BED = "twoBed",
  THREE_PLUS = "threePlusBed",
}

export enum unitSizeLabelEnum {
  micro = "Micro",
  studio = "Studio",
  oneBed = "1 Bed",
  twoBed = "2 Bed",
  threePlusBed = "3+ Bed",
}

export enum ProgramKeyEnum {
  P6 = "P6",
  P345 = "P345",
  ARCH_NEW = "ARCH_NEW",
  ARCH_OLD = "ARCH_OLD",
  other = "other",
}

export enum ProgramLabelEnum {
  P6 = "MFTE P6",
  P345 = "MFTE P3-5, IZ-Housing Bonus, MHA, or MPC-Yesler Terrace",
  ARCH_OLD = "ARCH before May 2019",
  ARCH_NEW = "ARCH after May 2019",
  other = "Other",
}

export enum OptionalUrlsKeyEnum {
  listingPageUrl = "listingPageUrl",
  walkTourUrl = "walkTourUrl",
  floorPlanUrl = "floorPlanUrl",
  otherUrl1 = "otherUrl1",
  otherUrl2 = "otherUrl2",
  otherUrl3 = "otherUrl3",
}

export enum OptionalUrlsLabelEnum {
  listingPageUrl = "Listing Page",
  walkTourUrl = "Walk Tour",
  floorPlanUrl = "Floor Plan",
  otherUrl1 = "Additional Link",
  otherUrl2 = "Additional Link 2",
  otherUrl3 = "Additional Link 3",
}

export enum OptionalUrlsSubtextEnum {
  listingPageUrl = "Optional URL. Include if different from the all listings link above",
  optionalUrl = "Optional URL",
}

export enum TableParentEnum {
  MARKER = "marker",
  LISTING_CARD = "listingCard",
  BUILDING_CARD = "buildingCard",
}

export enum BuildingCardEnum {
  BUILDING_LIST = "buildingList",
  MODAL = "modal",
}
