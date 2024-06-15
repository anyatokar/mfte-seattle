import { Timestamp } from "firebase/firestore";

export default interface IListingAptDetails {
  dateAvail: Timestamp;
  rent: string;
}
