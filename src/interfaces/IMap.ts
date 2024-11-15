import IBuilding from "./IBuilding";
import IListing from "./IListing";
import ISavedBuilding from "./ISavedBuilding";

export default interface IMap {
  resultBuildingsUnsorted: Array<IBuilding> | Array<ISavedBuilding>;
  savedBuildings: Array<ISavedBuilding>;
  allListings: Array<IListing> | [];
}
