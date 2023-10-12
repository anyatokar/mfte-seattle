import IRoute from '../interfaces/IRoute';
import HomePage from '../pages/home';
import BuildingsPage from '../pages/buildings';
import AboutPage from '../pages/about';
import ContactPage from '../pages/contact';
import ResourcesPage from '../pages/resources';
import SavedHomesPage from '../pages/saved-homes';
import DashboardPage from '../auth_components/Dashboard'

const routes: IRoute[] = [
  {
      path: '/',
      name: 'Home Page',
      component: HomePage,
      exact: true
  },
  {
      path: '/buildings',
      name: 'Buildings Page',
      component: BuildingsPage,
      exact: true
  },
  {
    path: '/about',
    name: 'About Page',
    component: AboutPage,
    exact: true
  },
  {
    path: '/contact-us',
    name: 'Contact Page',
    component: ContactPage,
    exact: true
  },
  {
    path: '/resources',
    name: 'Resources Page',
    component: ResourcesPage,
    exact: true
  },
  {
    path: '/saved-homes',
    name: 'Saved Homes Page',
    component: SavedHomesPage,
    exact: true
  },
  {
    path: '/dashboard',
    name: 'Dashboard Page',
    component: DashboardPage,
    exact: true
  },
  {
    path: '*',
    name: 'Home Page',
    component: HomePage,
    exact: true
  },
]

export default routes;