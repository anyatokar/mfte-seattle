import React, { createContext, useContext, useState, ReactNode } from "react";
import { Household } from "../components/search-and-filter/HouseholdDropdown";

interface HouseholdContextType {
  selectedHousehold: Household | null;
  setSelectedHousehold: (value: Household | null) => void;
}

const HouseholdContext = createContext<HouseholdContextType | null>(null);

export const HouseholdProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(
    null
  );

  return (
    <HouseholdContext.Provider
      value={{ selectedHousehold, setSelectedHousehold }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error("useHousehold must be used within a HouseholdProvider");
  }
  return context;
};
