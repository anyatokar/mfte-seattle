import React, { createContext, useContext } from "react";
import { useAllBuildings } from "../hooks/useAllBuildings";
import IBuilding from "../interfaces/IBuilding";
import IProps from "../interfaces/IProps";

type AllBuildingsContextType = [IBuilding[], boolean];

const AllBuildingsContext = createContext<AllBuildingsContextType | undefined>(
  undefined
);

export const useAllBuildingsContext = (): AllBuildingsContextType => {
  const context = useContext(AllBuildingsContext);
  if (!context) {
    throw new Error(
      "useAllBuildingsContext must be used within an AllBuildingsProvider"
    );
  }
  return context;
};

export const AllBuildingsProvider: React.FC<IProps> = ({ children }) => {
  const [allBuildings, isLoadingAllBuildings] = useAllBuildings();

  return (
    <AllBuildingsContext.Provider value={[allBuildings, isLoadingAllBuildings]}>
      {children}
    </AllBuildingsContext.Provider>
  );
};
