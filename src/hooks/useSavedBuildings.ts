import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import IBuilding from "../interfaces/IBuilding";
import { getUserDocRef } from "../utils/firestoreUtils";

export function useSavedBuildings(): [IBuilding[], boolean] {
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [isLoadingSavedBuildings, setIsLoadingSavedBuildings] = useState(true);

  const { currentUser, accountType } = useAuth();

  const getSavedBuildings = useCallback(() => {
    if (!currentUser || !accountType) return;

    setIsLoadingSavedBuildings(true);

    const userDocRef = getUserDocRef(currentUser.uid, accountType);

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
