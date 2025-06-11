import { Timestamp } from "firebase/firestore";
import { listingMaxDays } from "../config/constants";
import { listingStatusEnum } from "../types/enumTypes";
import IListing from "../interfaces/IListing";

export function timestampToDateAndTime(timestamp: string | Timestamp): string {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleString();
  }
  return timestamp;
}

export function timestampToDate(timestamp: Timestamp) {
  return timestamp.toDate().toLocaleDateString();
}

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${month}/${day}/${year}`;
};

/** Creates expiryDate in YYYY-MM-DD format */
export const getMaxExpiryDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + listingMaxDays);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Get the month (0-indexed, so +1)
  const day = String(today.getDate()).padStart(2, "0"); // Get the day

  return `${year}-${month}-${day}`;
};

/**
 * Returns the number of full days between the given Firestore Timestamp and today.
 * Always positive (i.e., "how many days ago").
 */
export function calculateDaysAgo(timestamp: Timestamp): number {
  const now = new Date();
  const targetDate = timestamp.toDate();

  // Strip time component for both dates to compare date-only
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const past = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffInMs = today.getTime() - past.getTime();
  const diffInDays = Math.max(0, Math.round(diffInMs / (1000 * 60 * 60 * 24)));

  return diffInDays;
}

// Input will always be number.
export function formatCurrency(amount: number | string): string {
  if (!amount || typeof amount !== "number") return "--";
  return `$${amount.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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

export function willShowAvailTable(listing: IListing) {
  if (!listing) return false;

  return (
    listing.listingStatus === listingStatusEnum.ACTIVE &&
    listing.availDataArray.length > 0
  );
}
