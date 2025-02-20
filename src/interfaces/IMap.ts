import IBuilding from "./IBuilding";
import ISavedBuilding from "./ISavedBuilding";

export default interface IMap {
  resultBuildingsUnsorted: Array<IBuilding>;
  savedBuildings: Array<ISavedBuilding>;
}
