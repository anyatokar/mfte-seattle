import IBuilding from "../interfaces/IBuilding";

export function buildingsFilter(
  building: IBuilding,
  activeFilters: Set<keyof IBuilding>
): boolean {
  if (activeFilters.size === 0) {
    return true;
  }

  return [...activeFilters].some((filterProperty) => building[filterProperty]);
}
