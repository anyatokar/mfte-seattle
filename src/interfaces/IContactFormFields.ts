import { Timestamp } from "firebase/firestore";

export interface IContactFormFields {
  authorName: string;
  email: string;
  role: string;
  subject: string;
  message: string;
}

export interface IContactData extends IContactFormFields {
  sentTimestamp: Timestamp;
}
