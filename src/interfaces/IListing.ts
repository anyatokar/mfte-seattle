import IListingAptDetails from "./IListingAptDetails";

export default interface IListing {
  name: string;
  address: string;
  url: string;
  startDate: string;
  endDate: string;
  lastUpdateDate: string;
  hasAnyAvailability: boolean;
  listingId: string;
  buildingID: string;
  seduAvail: IListingAptDetails;
  studioAvail: IListingAptDetails;
  oneBedAvail: IListingAptDetails;
  twoBedAvail: IListingAptDetails;
  threePlusBedAvail: IListingAptDetails;
}
