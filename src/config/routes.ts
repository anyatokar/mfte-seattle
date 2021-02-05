import IRoute from '../interfaces/route';
import BuildingsPage from '../pages/buildings';
import AboutMFTEPage from '../pages/about-mfte';
import AboutAppPage from '../pages/about-app';
import HomePage from '../pages/home';

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
    // {
    //     path: '/buildings/:number',
    //     name: 'Building Details Page',
    //     component: BuildingsPage,
    //     exact: true
    // },
]

export default routes;