import IRoute from "../interfaces/IRoute";

import AboutPage from "../pages/public-pages/About";
import AllBuildingsPage from "../pages/public-pages/AllBuildings";
import ContactPage from "../pages/public-pages/Contact";
import CookiePolicyPage from "../pages/public-pages/termly-pages/CookiePolicy";
import ForManagers from "../pages/public-pages/ForManagers";
import NotFoundPage from "../pages/public-pages/fallback-pages/NotFound";
import PrivacyPolicyPage from "../pages/public-pages/termly-pages/PrivacyPolicy";
import ResourcesPage from "../pages/public-pages/Resources";

const publicRoutes: IRoute[] = [
  {
    path: "/",
    name: "All Buildings Page",
    component: AllBuildingsPage,
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
    path: "/for-managers",
    name: "For Managers Page",
    component: ForManagers,
    exact: true,
  },
  {
    path: "/resources",
    name: "Resources Page",
    component: ResourcesPage,
    exact: true,
  },
  {
    path: "/privacy",
    name: "Privacy Policy Page",
    component: PrivacyPolicyPage,
    exact: true,
  },
  {
    path: "/cookies",
    name: "Cookie Policy Page",
    component: CookiePolicyPage,
    exact: true,
  },
  {
    path: "*",
    name: "Not Found Page",
    component: NotFoundPage,
    exact: true,
  },
];

export default publicRoutes;
