import { createContext, useContext, useState, ReactNode } from "react";
import { UnitAvailData } from "../interfaces/IListing";

interface UnitAvailDataContextType {
  unitAvailDataContext: UnitAvailData | null;
  setUnitAvailDataContext: (data: UnitAvailData | null) => void;
}

const UnitAvailDataContext = createContext<
  UnitAvailDataContextType | undefined
>(undefined);

export const UnitAvailDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unitAvailDataContext, setUnitAvailDataContext] =
    useState<UnitAvailData | null>(null);

  return (
    <UnitAvailDataContext.Provider
      value={{
        unitAvailDataContext: unitAvailDataContext,
        setUnitAvailDataContext: setUnitAvailDataContext,
      }}
    >
      {children}
    </UnitAvailDataContext.Provider>
  );
};

export const useUnitAvailData = () => {
  const context = useContext(UnitAvailDataContext);
  if (!context) {
    throw new Error(
      "useUnitAvailData must be used within a UnitAvailDataProvider"
    );
  }
  return context;
};
