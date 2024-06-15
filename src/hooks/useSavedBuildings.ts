import { useCallback, useState, useEffect } from "react";

import { collection, doc, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";

import { useAuth } from "../contexts/AuthContext";
import IBuilding from "../interfaces/IBuilding";

export function useSavedBuildings(): [IBuilding[], boolean] {
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loadingSavedBuildings, setLoadingSavedBuildings] = useState(false);

  const { currentUser } = useAuth();

  const getSavedBuildings = useCallback(() => {
    if (!currentUser) return;

    setLoadingSavedBuildings(true);

    const userDocRef = doc(db, "users", currentUser.uid);
    const q = query(collection(userDocRef, "savedHomes"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Getting saved buildings.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setSavedBuildings(buildings);
      setLoadingSavedBuildings(false);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  useEffect(() => {
    getSavedBuildings();
  }, [getSavedBuildings]);

  return [savedBuildings, loadingSavedBuildings];
}
