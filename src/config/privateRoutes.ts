import IRoute from "../interfaces/IRoute";

import ManageProfilePage from "../pages/private-pages/ManageProfile";
import ManageListingsPage from "../pages/private-pages/ManageListings";

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
  },
];

export default privateRoutes;
