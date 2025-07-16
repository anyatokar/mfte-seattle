import { createContext, useContext, useState, ReactNode } from "react";
import { UnitAvailData } from "../interfaces/IListing";

interface UnitAvailDataContextType {
  unitAvailData: UnitAvailData | null;
  setUnitAvailData: (data: UnitAvailData | null) => void;
}

const UnitAvailDataContext = createContext<
  UnitAvailDataContextType | undefined
>(undefined);

export const UnitAvailDataProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [unitAvailData, setUnitAvailData] = useState<UnitAvailData | null>(
    null
  );

  return (
    <UnitAvailDataContext.Provider value={{ unitAvailData, setUnitAvailData }}>
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
