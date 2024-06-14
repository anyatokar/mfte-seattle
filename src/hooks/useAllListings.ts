import { useCallback, useState, useEffect } from "react";

import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import IListing from "../interfaces/IListing";

export function useAllListings(): [IListing[], boolean] {
  const [allListings, setAllListings] = useState([] as Array<IListing>);
  const [loadingAllListings, setLoadingAllListings] = useState(false);

  const getAllListings = useCallback(() => {
    setLoadingAllListings(true);

    const q = query(collection(db, "listings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Getting listings.");
      const listings: Array<IListing> = [];
      querySnapshot.forEach((doc) => {
        listings.push(doc.data() as IListing);
      });
      setAllListings(listings);
      setLoadingAllListings(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    getAllListings();
  }, [getAllListings]);

  return [allListings, loadingAllListings];
}
