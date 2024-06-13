export default interface IListing {
  name: string;
  address: string;
  url: string;
  startDate: string;
  endDate: string;
  lastUpdateDate: string;
  hasSeduListing: boolean;
  hasStudioListing: boolean;
  hasOneBedListing: boolean;
  hasTwoBedListing: boolean;
  hasThreePlusListing: boolean;
  hasAnyAvailability: boolean;
  listingId: string;
  buildingID: string;
  seduRent: string;
  studioRent: string;
  oneBedRent: string;
  twoBedRent: string;
  threePlusBedRent: string;
}
