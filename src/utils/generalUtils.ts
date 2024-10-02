import { Timestamp } from "firebase/firestore";

// Used to save note timestamp as string in database, hence the check here.
export function timestampToDateAndTime(timestamp: string | Timestamp): string {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

export function timestampToDate(timestamp: Timestamp) {
  return timestamp.toDate().toLocaleDateString();
}

export function checkPassword(
  passwordValue: string,
  passwordConfirmValue: string
) {
  let error = "";
  if (passwordValue !== passwordConfirmValue) {
    error = "Passwords do not match. ";
  }

  if (passwordValue.length < 6) {
    error += "Password must be at least 6 characters.";
  }

  if (error) console.error(error);
  return error;
}
