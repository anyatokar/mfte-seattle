import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IBuilding from "../interfaces/IBuilding";

export const useAllBuildings = (): [IBuilding[], boolean] => {
  const [allBuildings, setAllBuildings] = useState<Array<IBuilding>>([]);
  const [isLoadingAllBuildings, setIsLoadingAllBuildings] = useState(false);

  const q = query(collection(db, "buildings"));

  const getAllBuildings = useCallback(() => {
    console.log("Getting all buildings.");
    setIsLoadingAllBuildings(true);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setAllBuildings(buildings);
      setIsLoadingAllBuildings(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllBuildings();
  }, [getAllBuildings]);

  return [allBuildings, isLoadingAllBuildings];
};
