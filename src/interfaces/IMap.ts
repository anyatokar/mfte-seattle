import IBuilding from "./IBuilding";
import ISavedBuilding from "./ISavedBuilding";

export default interface IMap {
  resultBuildingsUnsorted: Array<IBuilding> | Array<ISavedBuilding>;
  savedBuildings: Array<ISavedBuilding>;
}
