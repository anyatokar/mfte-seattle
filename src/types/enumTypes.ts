export enum pageTypeEnum {
  allBuildings = "allBuildings",
  savedBuildings = "savedBuildings",
}

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
