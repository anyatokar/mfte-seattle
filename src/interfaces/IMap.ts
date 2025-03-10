import { MutableRefObject } from "react";
import IBuilding from "./IBuilding";
import ISavedBuilding from "./ISavedBuilding";

export default interface IMap {
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  mapHeight: number;
  shouldScroll: MutableRefObject<boolean>;
}
