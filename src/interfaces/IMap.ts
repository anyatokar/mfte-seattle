import { MutableRefObject } from "react";
import IBuilding from "./IBuilding";
import ISavedBuilding from "./ISavedBuilding";

export default interface IMap {
  resultBuildingsUnsorted: IBuilding[];
  savedBuildings: ISavedBuilding[];
  mapHeight: number;
  shouldScroll: MutableRefObject<boolean>;
  setSelectedBuildingId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedBuildingId: string | null;
}
