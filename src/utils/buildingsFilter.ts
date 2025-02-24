import IBuilding, { AmiData, AmiPercentage } from "../interfaces/IBuilding";

import { BedroomsKeyEnum, listingStatusEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
  ami: Set<string>;
  isAvailOnly: boolean;
  isSavedOnly: boolean;
};

function filterBedrooms(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { bedrooms, isAvailOnly } = activeFilters;

  if (bedrooms.size === 0) return true;

  if (isAvailOnly) {
    if (!building.listing) return false;

    return [...bedrooms].some((checkedBedroom) =>
      building.listing.availDataArray.some(
        (availObj) =>
          availObj.unitSize === checkedBedroom && Number(availObj.numAvail) > 0
      )
    );
  }

  for (let selectedBedroom of [...bedrooms]) {
    return (
      building.amiData[selectedBedroom] &&
      building.amiData[selectedBedroom].length > 0
    );
  }

  return false;
}

function filterAmi(building: IBuilding, activeFilters: ActiveFilters): boolean {
  const { ami, bedrooms } = activeFilters;

  if (ami.size === 0) return true;

  const fullBedroomSet = new Set([
    BedroomsKeyEnum.MICRO,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ]);

  const bedroomSet = bedrooms.size === 0 ? fullBedroomSet : bedrooms;

  // TODO: Collect realtime AMI percentage data so that this filter can be applied to it.
  // This is just looking at fixed data.
  for (const selectedBedroom of bedroomSet) {
    const amiDataForBedroom =
      building.amiData[selectedBedroom as keyof AmiData];

    for (const amiFilterUnit of [...ami]) {
      if (
        amiDataForBedroom &&
        amiDataForBedroom.includes(Number(amiFilterUnit) as AmiPercentage)
      )
        return true;
    }
  }

  return false;
}

export function buildingsFilter(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { isAvailOnly, neighborhoods } = activeFilters;

  const listingsResult =
    (isAvailOnly &&
      building.listing?.listingStatus === listingStatusEnum.ACTIVE) ||
    !isAvailOnly;

  const bedroomsResult = filterBedrooms(building, activeFilters);

  const neighborhoodsResult =
    // If no boxes are checked, evaluate to be the same as the box is checked - omit that dropdown.
    neighborhoods.size === 0 ||
    neighborhoods.has(building.address.neighborhood);

  const amiResult = filterAmi(building, activeFilters);

  return listingsResult && bedroomsResult && neighborhoodsResult && amiResult;
}
