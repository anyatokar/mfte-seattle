import { Timestamp } from "firebase/firestore";

export default interface ISavedBuilding {
  buildingID: string;
  buildingName: string;
  updatedTimestamp: Timestamp;
  note?: string;
  noteTimestamp?: string | Timestamp;
}
