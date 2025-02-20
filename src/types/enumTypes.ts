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

export enum BedroomLabelEnum {
  micro = "Micro",
  studio = "Studio",
  oneBed = "One",
  twoBed = "Two",
  threePlusBed = "Three+",
}
