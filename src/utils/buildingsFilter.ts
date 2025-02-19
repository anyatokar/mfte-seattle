import IBuilding from "../interfaces/IBuilding";
import IListing, { UnitSize } from "../interfaces/IListing";
import { BedroomsKeyEnum } from "../types/enumTypes";

export type ActiveFilters = {
  bedrooms: Set<BedroomsKeyEnum>;
  neighborhoods: Set<string>;
  isAvailOnly: boolean;
  isSavedOnly: boolean;
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

function hasListings(listing: IListing) {
  if (!listing) return false;

  const expiryDate = new Date(listing.expiryDate);
  const currentDate = new Date();

  return (
    listing && listing.listingStatus === "active" && currentDate < expiryDate
  );
}

export function buildingsFilter(
  building: IBuilding,
  activeFilters: ActiveFilters
): boolean {
  const { neighborhoods } = activeFilters;

  const listingsResult =
    (activeFilters.isAvailOnly && hasListings(building.listing)) ||
    !activeFilters.isAvailOnly;
  const bedroomsResult = filterBedrooms(building, activeFilters);
  const neighborhoodsResult =
    // If no boxes are checked, evaluate to be the same as the box is checked - omit that dropdown.
    activeFilters.neighborhoods.size === 0 ||
    neighborhoods.has(building.residentialTargetedArea);

  return listingsResult && bedroomsResult && neighborhoodsResult;
}
