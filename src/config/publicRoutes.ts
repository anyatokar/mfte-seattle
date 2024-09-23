import IRoute from "../interfaces/IRoute";

import AboutPage from "../pages/About";
import AddListingPage from "../pages/AddListing";
import AllBuildingsPage from "../pages/AllBuildings";
import ContactPage from "../pages/Contact";
import HomePage from "../pages/Home";
import ResourcesPage from "../pages/Resources";
import CookiesPolicyPage from "../pages/CookiesPolicy";
import PrivacyPolicyPage from "../pages/PrivacyPolicy";

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
    path: "/add-listing",
    name: "Add Listing Page",
    component: AddListingPage,
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
    name: "Cookies Policy Page",
    component: CookiesPolicyPage,
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
