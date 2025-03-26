import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import { ITempBuilding } from "../utils/firestoreUtils";

export const useTempBuildings = (): [ITempBuilding[], boolean] => {
  const [allTempBuildings, setTempBuildings] = useState<ITempBuilding[]>([]);
  const [isLoadingTempBuildings, setIsLoadingTempBuildings] = useState(true);

  const getTempBuildings = useCallback(() => {
    setIsLoadingTempBuildings(true);
    const q = query(collection(db, "temp_buildings"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("Temp buildings snapshot.");
      const buildings: Array<ITempBuilding> = [];
      querySnapshot.forEach((doc) => {
        const building = doc.data() as ITempBuilding;
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
