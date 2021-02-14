import IRoute from '../interfaces/IRoute';
import BuildingsPage from '../pages/buildings';
import AboutMFTEPage from '../pages/about-mfte';
import AboutAppPage from '../pages/about-app';
import HomePage from '../pages/home';
import SavedHomesPage from '../pages/saved-homes';
import SavedByUserPage from '../pages/saved-by-user';
import SavedSearchesPage from '../pages/saved-searches';
import DashboardPage from '../auth_components/Dashboard'
// import LoginModal from '../auth_components/Login'
// import SignupModal from '../auth_components/Signup'
// import ForgotPasswordModal from '../auth_components/ForgotPassword'


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
    {
      path: '/dashboard',
      name: 'Dashboard Page',
      component: DashboardPage,
      exact: true
    },
    {
      path: '/saved-by-user',
      name: 'Saved Page',
      component: SavedByUserPage,
      exact: true
    },
    {
      path: '*',
      name: 'Home Page',
      component: HomePage,
      exact: true
    },

    // {
    //   path: '/buildings/signup',
    //   name: 'Signup Modal',
    //   component: SignupModal,
    //   exact: true
    // },
    // {
    //   path: '/../password-reset',
    //   name: 'Forgot Password Modal',
    //   component: ForgotPasswordModal,
    //   exact: true
    // },
//     {
//         path: '/buildings/:number',
//         name: 'Building Details Page',
//         component: BuildingsPage,
//         exact: true
//     },
]

export default routes;