import { AllBuildingsProvider } from "../contexts/AllBuildingsContext";
import { HouseholdProvider } from "../contexts/HouseholdContext";
import { TempBuildingsProvider } from "../contexts/TempBuildingsContext";
import { UnitAvailDataProvider } from "../contexts/UnitAvailDataContext";
import ManageProfilePage from "../pages/private-pages/ManageProfile";
import ManageListingsPage from "../pages/private-pages/ManageListings";
import IRoute from "../interfaces/IRoute";

const privateRoutes: IRoute[] = [
  {
    path: "/manage-profile",
    name: "Manage Profile Page",
    component: ManageProfilePage,
    exact: true,
  },
  {
    path: "/manage-listings",
    name: "Manage Listings Page",
    component: ManageListingsPage,
    exact: true,
    wrapWith: [
      AllBuildingsProvider,
      TempBuildingsProvider,
      UnitAvailDataProvider,
      HouseholdProvider,
    ],
  },
];

export default privateRoutes;
