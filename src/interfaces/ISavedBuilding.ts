import IBuilding from "./IBuilding";

export default interface ISavedBuilding extends IBuilding {
  note?: string;
  noteTimestamp?: string;
}
