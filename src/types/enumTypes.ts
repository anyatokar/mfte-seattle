export enum tableType {
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
}

export enum ProgramLabelEnum {
  P6 = "MFTE P6",
  P345 = "MFTE Programs 3-5, IZ-Housing Bonus, MHA, MPC-Yesler Terrace",
}
