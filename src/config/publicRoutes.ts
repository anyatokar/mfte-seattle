import IRoute from "../interfaces/IRoute";

import AboutPage from "../pages/About";
import AllBuildingsPage from "../pages/AllBuildings";
import ContactPage from "../pages/Contact";
import HomePage from "../pages/Home";
import ResourcesPage from "../pages/Resources";

const publicRoutes: IRoute[] = [
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
    path: "/contact",
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
    path: "*",
    name: "Home Page",
    component: HomePage,
    exact: true,
  },
];

export default publicRoutes;
