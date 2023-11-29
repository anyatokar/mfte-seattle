import AboutPage from "../pages/About";
import AllBuildingsPage from "../pages/AllBuildings";
import IRoute from "../interfaces/IRoute";

import ContactPage from "../pages/Contact";
import HomePage from "../pages/Home";
import ManageProfilePage from "../pages/ManageProfile";
import ResourcesPage from "../pages/Resources";
import SavedBuildingsPage from "../pages/SavedBuildings";

const routes: IRoute[] = [
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
    exact: true,
  },
  {
    path: "/all-buildings",
    name: "All Buildings Page",
    component: AllBuildingsPage,
    exact: true,
  },
  {
    path: "/about",
    name: "About Page",
    component: AboutPage,
    exact: true,
  },
  {
    path: "/contact-us",
    name: "Contact Page",
    component: ContactPage,
    exact: true,
  },
  {
    path: "/resources",
    name: "Resources Page",
    component: ResourcesPage,
    exact: true,
  },
  {
    path: "/saved-buildings",
    name: "Saved Buildings Page",
    component: SavedBuildingsPage,
    exact: true,
  },
  {
    path: "/manage-profile",
    name: "Manage Profile Page",
    component: ManageProfilePage,
    exact: true,
  },
  {
    path: "*",
    name: "Home Page",
    component: HomePage,
    exact: true,
  },
];

export default routes;
