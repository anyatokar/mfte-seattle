import { useCallback, useState, useEffect } from 'react';
import firebase from '../db/firebase';
import 'firebase/firestore';

import IBuilding from "../interfaces/IBuilding";

export function useSavedBuildings(currentUser: any): [IBuilding[], boolean] {
  const ref = firebase.firestore().collection("users").doc(currentUser.uid).collection("savedHomes")
  const [savedBuildings, setSavedBuildings] = useState([] as Array<IBuilding>);
  const [loading, setLoading] = useState(false);

  const getSavedBuildings = useCallback(() => {
    setLoading(true) 
    ref.onSnapshot((querySnapshot) => {
    const items: Array<IBuilding> = [];
    querySnapshot.forEach((doc) => {
      items.push(doc.data() as IBuilding);
    });
    setSavedBuildings(items)
    setLoading(false)
    });
  }, []);

  useEffect(() => {getSavedBuildings()}, [getSavedBuildings]);

  return [savedBuildings, loading];
}
