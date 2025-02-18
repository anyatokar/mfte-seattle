import IBuilding from "../interfaces/IBuilding";
import { UnitSize } from "../interfaces/IListing";
import { BedroomsKeyEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
  isAvailOnly: boolean;
};

function filterBedrooms(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { bedrooms, isAvailOnly } = activeFilters;

  // If no filters are applied, return true.
  if (bedrooms.size === 0) return true;

  const unitSizeToBedroomsKey: Record<UnitSize, BedroomsKeyEnum> = {
    micro: BedroomsKeyEnum.SEDU,
    studio: BedroomsKeyEnum.STUDIO,
    oneBed: BedroomsKeyEnum.ONE_BED,
    twoBed: BedroomsKeyEnum.TWO_BED,
    threePlusBed: BedroomsKeyEnum.THREE_PLUS,
  };

  if (isAvailOnly) {
    return (
      building.listing?.availData.some((unit) =>
        bedrooms.has(unitSizeToBedroomsKey[unit.unitSize])
      ) ?? false
    );
  }

  return [...bedrooms].some((filterProperty) =>
    Boolean(building[filterProperty])
  );
}

export function buildingsFilter(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { neighborhoods } = activeFilters;

  const bedroomsResult = filterBedrooms(building, activeFilters);

  const neighborhoodsResult =
    // If no boxes are checked, evaluate to be the same as the box is checked - omit that dropdown.
    activeFilters.neighborhoods.size === 0 ||
    neighborhoods.has(building.residentialTargetedArea);

  return bedroomsResult && neighborhoodsResult;
}
