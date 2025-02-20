import IBuilding, { amiPercentageType } from "../interfaces/IBuilding";
import { UnitSize } from "../interfaces/IListing";
import { BedroomsKeyEnum, listingStatusEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
  ami: Set<string>;
  isAvailOnly: boolean;
  isSavedOnly: boolean;
};

const unitSizeToBedroomsKey: Record<UnitSize, BedroomsKeyEnum> = {
  micro: BedroomsKeyEnum.SEDU,
  studio: BedroomsKeyEnum.STUDIO,
  oneBed: BedroomsKeyEnum.ONE_BED,
  twoBed: BedroomsKeyEnum.TWO_BED,
  threePlusBed: BedroomsKeyEnum.THREE_PLUS,
};

function filterBedrooms(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { bedrooms, isAvailOnly } = activeFilters;

  // If no filters are applied, return true.
  if (bedrooms.size === 0) return true;

  if (isAvailOnly) {
    if (!building.listing) return false;

    return [...bedrooms].some((filterProperty) =>
      building.listing.availData.some(
        (avails) =>
          unitSizeToBedroomsKey[avails.unitSize] === filterProperty &&
          Number(avails.numAvail) > 0
      )
    );
  }

  return [...bedrooms].some((filterProperty) => !!building[filterProperty]);
}

function filterAmi(building: IBuilding, activeFilters: ActiveFilters): boolean {
  const { ami, bedrooms } = activeFilters;

  if (ami.size === 0) return true;

  const fullBedroomSet = new Set([
    BedroomsKeyEnum.SEDU,
    BedroomsKeyEnum.STUDIO,
    BedroomsKeyEnum.ONE_BED,
    BedroomsKeyEnum.TWO_BED,
    BedroomsKeyEnum.THREE_PLUS,
  ]);

  const bedroomSet = bedrooms.size === 0 ? fullBedroomSet : bedrooms;

  for (const selectedBedroom of bedroomSet) {
    for (const amiFilterUnit of [...ami]) {
      for (const buildingAmiData of building.amiData) {
        if (
          unitSizeToBedroomsKey[buildingAmiData.unitSize] === selectedBedroom &&
          buildingAmiData.amiPercentages.includes(
            Number(amiFilterUnit) as amiPercentageType
          )
        ) {
          return true;
        }
      }
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
    neighborhoods.has(building.residentialTargetedArea);

  const amiResult = filterAmi(building, activeFilters);

  return listingsResult && bedroomsResult && neighborhoodsResult && amiResult;
}
