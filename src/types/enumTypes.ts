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
  other = "other",
}

export enum ProgramLabelEnum {
  P6 = "MFTE P6",
  P345 = "MFTE P3-5, IZ-Housing Bonus, MHA, or MPC-Yesler Terrace",
  other = "Other",
}

export enum OptionalUrlsKeyEnum {
  listingPageUrl = "listingPageUrl",
  walkTourUrl = "walkTourUrl",
  floorPlanUrl = "floorPlanUrl",
  otherUrl1 = "otherUrl1",
  otherUrl2 = "otherUrl2",
}

export enum OptionalUrlsLabelEnum {
  listingPageUrl = "Listing Page",
  walkTourUrl = "Walk Tour",
  floorPlanUrl = "Floor Plan",
  otherUrl1 = "Additional Link",
  otherUrl2 = "Additional Link 2",
}

export enum OptionalUrlsSubtextEnum {
  listingPageUrl = "Optional URL. Include if different from All Listings URL",
  optionalUrl = "Optional URL",
}

export enum TableParentEnum {
  MARKER = "marker",
  LISTING_CARD = "listingCard",
  BUILDING_CARD = "buildingCard",
}
