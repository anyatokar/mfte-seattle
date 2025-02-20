import { Timestamp } from "firebase/firestore";

export default interface ISavedBuilding {
  buildingID: string;
  buildingName: string;
  note?: string;
  noteTimestamp?: string | Timestamp;
  updatedTimestamp: Timestamp;
}
