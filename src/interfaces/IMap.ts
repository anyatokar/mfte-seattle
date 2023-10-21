import IBuilding from "./IBuilding"
import ISavedBuilding from "./ISavedBuilding"

export default interface IMap {
  buildingsToMap: Array<IBuilding> | Array<ISavedBuilding>
  savedBuildings: Array<ISavedBuilding>
}
