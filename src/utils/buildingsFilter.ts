import IBuilding, { PercentAmi } from "../interfaces/IBuilding";
import { BedroomsKeyEnum, listingStatusEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
  ami: Set<PercentAmi>;
  isAvailOnly: boolean;
  isSavedOnly: boolean;
  isAgeRestrictedOnly: boolean;
};

function filterBedroomsAndAmi(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { bedrooms, ami, isAvailOnly } = activeFilters;

  if (bedrooms.size === 0 && ami.size === 0) return true;
  if (isAvailOnly && !building.listing) return false;

  // If no amis are selected
  if (ami.size === 0) {
    for (const selectedBedroom of [...bedrooms]) {
      const data = isAvailOnly
        ? building.listing.availDataArray.find(
            (unitAvailData) => unitAvailData.unitSize === selectedBedroom
          )?.percentAmi
        : building.amiData[selectedBedroom];

      if (data && data.length > 0) {
        return true;
      }
    }

    return false;
  }

  // If no bedrooms are selected
  if (bedrooms.size === 0) {
    // Put all the ami values into a set, see if the set includes selected ami.
    const data = isAvailOnly
      ? new Set(
          building.listing.availDataArray
            .flatMap((unitAvailData) => unitAvailData.percentAmi)
            .filter((percent) => percent !== undefined)
        )
      : // TODO: Consider amis array in the building data to reduce operations needed
        new Set(Object.values(building.amiData).flat());

    for (const selectedAmi of [...ami]) {
      if (data.has(selectedAmi)) {
        return true;
      }
    }

    return false;
  }

  // If some amis and some bedrooms are selected
  for (const selectedBedroom of [...bedrooms]) {
    for (const selectedAmi of [...ami]) {
      const data = isAvailOnly
        ? building.listing.availDataArray.find(
            (unitAvailData) => unitAvailData.unitSize === selectedBedroom
          )?.percentAmi
        : building.amiData[selectedBedroom];

      if (data && data.includes(selectedAmi)) {
        return true;
      }
    }
  }

  return false;
}

export function buildingsFilter(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { isAvailOnly, neighborhoods, isAgeRestrictedOnly } = activeFilters;

  const listingsResult =
    !isAvailOnly ||
    (isAvailOnly &&
      building.listing?.listingStatus === listingStatusEnum.ACTIVE);
  const bedroomsAndAmiResult = filterBedroomsAndAmi(building, activeFilters);
  const neighborhoodsResult =
    // If no boxes are checked, evaluate as if the box is checked - aka omit that dropdown.
    neighborhoods.size === 0 ||
    neighborhoods.has(building.address.neighborhood);
  const isAgeRestrictedResult =
    !isAgeRestrictedOnly ||
    (isAgeRestrictedOnly && building.isAgeRestricted === true);

  return (
    listingsResult &&
    bedroomsAndAmiResult &&
    neighborhoodsResult &&
    isAgeRestrictedResult
  );
}
