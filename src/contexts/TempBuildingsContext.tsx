import React, { createContext, useContext } from "react";
import { useTempBuildings } from "../hooks/useTempBuildings";
import IProps from "../interfaces/IProps";
import { ITempBuilding } from "../interfaces/ITempBuilding";

type TempBuildingsContext = [ITempBuilding[], boolean];

const TempBuildingsContext = createContext<
  TempBuildingsContext | undefined
>(undefined);

export const useTempBuildingsContext = (): TempBuildingsContext => {
  const context = useContext(TempBuildingsContext);
  if (!context) {
    throw new Error(
      "useTempBuildingsContext must be used within an TempBuildingsProvider"
    );
  }
  return context;
};

export const TempBuildingsProvider: React.FC<IProps> = ({ children }) => {
  const [tempBuildings, isLoadingTempBuildings] = useTempBuildings();

  return (
    <TempBuildingsContext.Provider
      value={[tempBuildings, isLoadingTempBuildings]}
    >
      {children}
    </TempBuildingsContext.Provider>
  );
};
