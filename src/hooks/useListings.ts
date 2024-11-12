import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IListing from "../interfaces/IListing";

export function useAllListings(
  omitExpired: boolean,
  managerID?: string
): [IListing[], boolean] {
  const [allListings, setAllListings] = useState<IListing[]>([]);
  const [isLoadingAllListings, setIsLoadingAllListings] = useState(true);

  const getAllListings = useCallback(() => {
    setIsLoadingAllListings(true);
    const q = query(collection(db, "listings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Listings snapshot.");
      const listings: IListing[] = [];
      querySnapshot.forEach((doc) => {
        listings.push(doc.data() as IListing);
      });

      // Filter out expired listings for map pages
      if (omitExpired) {
        const nonExpiredListings = listings.filter(
          (listing) => new Date(listing.expiryDate) < new Date()
        );
        setAllListings(nonExpiredListings);
      } else {
        setAllListings(listings);
      }

      // Filter by managerID if provided
      if (managerID) {
        const managersListings = listings.filter(
          (listing) => listing.managerID === managerID
        );
        setAllListings(managersListings);
      } else {
        setAllListings(listings);
      }

      setIsLoadingAllListings(false);
    });

    return unsubscribe;
  }, [omitExpired, managerID]);

  useEffect(() => {
    const unsubscribe = getAllListings();
    return () => {
      unsubscribe();
    };
  }, [getAllListings]);

  return [allListings, isLoadingAllListings];
}
