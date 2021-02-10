import IRoute from '../interfaces/route';
import BuildingsPage from '../pages/buildings';
import AboutMFTEPage from '../pages/about-mfte';
import AboutAppPage from '../pages/about-app';
import HomePage from '../pages/home';
import SavedHomesPage from '../pages/saved-homes';
import SavedSearchesPage from '../pages/saved-searches';
import LoginModal from '../auth_components/Login'


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
      path: '/saved-searches',
      name: 'Saved Searches Page',
      component: SavedSearchesPage,
      exact: true
    },

    // {
    //   path: '/buildings/login',
    //   name: 'Login Modal',
    //   component: LoginModal,
    //   exact: true
    // },
    // {
    //     path: '/buildings/:number',
    //     name: 'Building Details Page',
    //     component: BuildingsPage,
    //     exact: true
    // },
]

export default routes;