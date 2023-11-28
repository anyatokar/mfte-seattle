import IRoute from "../interfaces/IRoute";
import HomePage from "../pages/Home";
import BuildingsPage from "../pages/Buildings";
import AboutPage from "../pages/About";
import ContactPage from "../pages/Contact";
import ResourcesPage from "../pages/Resources";
import SavedBuildingsPage from "../pages/Saved";
import DashboardPage from "../auth_components/Dashboard";

const routes: IRoute[] = [
  {
    path: "/",
    name: "Home Page",
    component: HomePage,
    exact: true,
  },
  {
    path: "/buildings",
    name: "Buildings Page",
    component: BuildingsPage,
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
    path: "/saved",
    name: "Saved Buildings Page",
    component: SavedBuildingsPage,
    exact: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard Page",
    component: DashboardPage,
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
