import { useCallback, useState, useEffect } from "react";
import firebase from "../db/firebase";
import "firebase/firestore";

import { useAuth } from "../contexts/AuthContext";
import IBuilding from "../interfaces/IBuilding";

export function useSavedBuildings(): [IBuilding[], boolean] {
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useAuth() as any;

  const getSavedBuildings = useCallback(() => {
    if (!currentUser) return;

    setLoading(true);

    const ref = firebase
      .firestore()
      .collection("users")
      .doc(currentUser?.uid)
      .collection("savedHomes");
    ref?.onSnapshot((querySnapshot) => {
      const items: Array<IBuilding> = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data() as IBuilding);
      });
      setSavedBuildings(items);
      setLoading(false);
    });
  }, [currentUser]);

  useEffect(() => {
    getSavedBuildings();
  }, [getSavedBuildings]);

  return [savedBuildings, loading];
}
