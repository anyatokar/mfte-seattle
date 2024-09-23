import { useCallback, useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../db/firebase";
import IBuilding from "../interfaces/IBuilding";

export const useAllBuildings = () => {
  const [allBuildings, setAllBuildings] = useState<Array<IBuilding>>([]);
  const [loading, setLoading] = useState(false);

  const q = query(collection(db, "buildings"));

  const getAllBuildings = useCallback(() => {
    console.log("Getting all buildings.");
    setLoading(true);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const buildings: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        buildings.push(doc.data() as IBuilding);
      });
      setAllBuildings(buildings);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllBuildings();
  }, [getAllBuildings]);

  return { allBuildings, loading };
};
