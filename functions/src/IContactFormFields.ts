import { Timestamp } from "firebase/firestore";

export interface IContactFormFields {
  authorName: string;
  email: string;
  description: string;
  subject: string;
  message: string;
};

export interface IContactData extends IContactFormFields {
  sentTimestamp: Timestamp;
}


