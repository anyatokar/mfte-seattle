import IRoute from '../interfaces/IRoute';
import BuildingsPage from '../pages/buildings';
import AboutMFTEPage from '../pages/about-mfte';
import AboutAppPage from '../pages/about-app';
import HomePage from '../pages/home';
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
    path: '/about-mfte',
    name: 'About MFTE Page',
    component: AboutMFTEPage,
    exact: true
  },
  {
    path: '/about-app',
    name: 'About App Page',
    component: AboutAppPage,
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