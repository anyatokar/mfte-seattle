import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IBuilding from "../interfaces/IBuilding";

export const useTempBuildings = (): [IBuilding[], boolean] => {
  const [allTempBuildings, setTempBuildings] = useState<IBuilding[]>([]);
  const [isLoadingTempBuildings, setIsLoadingTempBuildings] = useState(true);

  const getTempBuildings = useCallback(() => {
    setIsLoadingTempBuildings(true);
    const q = query(collection(db, "new_buildings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Temp buildings snapshot.");
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        const building = doc.data() as IBuilding;
        buildings.push(building);
      });

      setTempBuildings(buildings);
      setIsLoadingTempBuildings(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = getTempBuildings();
    return () => {
      unsubscribe();
    };
  }, [getTempBuildings]);

  return [allTempBuildings, isLoadingTempBuildings];
};
