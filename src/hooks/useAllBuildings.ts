import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IBuilding from "../interfaces/IBuilding";

export const useAllBuildings = (shouldFetch = true): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<Array<IBuilding>>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(true);

  const getAllBuildings = useCallback(() => {
    setIsLoadingAllBuildings(true);
    const q = query(collection(db, "buildings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Buildings snapshot.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setAllBuildings(buildings);
      setIsLoadingAllBuildings(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      const unsubscribe = getAllBuildings();
      return () => {
        unsubscribe();
      };
    } else {
      setIsLoadingAllBuildings(false);
    }
  }, [getAllBuildings, shouldFetch]);

  return [allBuildings, isLoadingAllBuildings];
};
