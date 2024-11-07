import IRoute from "../interfaces/IRoute";

import ManageProfilePage from "../pages/ManageProfile";
import SavedBuildingsPage from "../pages/SavedBuildings";
import ManageListingsPage from "../pages/ManageListings";

const privateRoutes: IRoute[] = [
  {
    path: "/manage-profile",
    name: "Manage Profile Page",
    component: ManageProfilePage,
    exact: true,
  },
  {
    path: "/saved-buildings",
    name: "Saved Buildings Page",
    component: SavedBuildingsPage,
    exact: true,
  },
  {
    path: "/manage-listings",
    name: "Manage Listings Page",
    component: ManageListingsPage,
    exact: true,
  },
];

export default privateRoutes;
