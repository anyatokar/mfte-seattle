import { useCallback, useState, useEffect } from "react";
import { collection, doc, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import { useAuth } from "../contexts/AuthContext";
import IBuilding from "../interfaces/IBuilding";

export function useSavedBuildings(): [IBuilding[], boolean] {
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [isLoadingSavedBuildings, setIsLoadingSavedBuildings] = useState(true);

  const { currentUser } = useAuth();

  const getSavedBuildings = useCallback(() => {
    if (!currentUser) return;

    setIsLoadingSavedBuildings(true);
    const userDocRef = doc(db, "users", currentUser.uid);
    const q = query(collection(userDocRef, "savedHomes"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Saved buildings snapshot.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setSavedBuildings(buildings);
      setIsLoadingSavedBuildings(false);
    });

    return unsubscribe;
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = getSavedBuildings();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      setIsLoadingSavedBuildings(false);
    }
  }, [getSavedBuildings, currentUser]);

  return [savedBuildings, isLoadingSavedBuildings];
}
