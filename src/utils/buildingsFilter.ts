import IBuilding from "../interfaces/IBuilding";
import { BedroomsKeyEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
};

export function buildingsFilter(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { bedrooms, neighborhoods } = activeFilters;

  // If no boxes are checked it's evaluated to be the same as the box is checked, basically omits that dropdown.
  const bedroomsResult =
    activeFilters.bedrooms.size === 0 ||
    [...bedrooms].some((filterProperty) => building[filterProperty]);

  const neighborhoodsResult =
    activeFilters.neighborhoods.size === 0 ||
    neighborhoods.has(building.residentialTargetedArea);

  return bedroomsResult && neighborhoodsResult;
}
