import IRoute from '../types/route';
import BuildingsPage from '../pages/buildings';
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
        path: '/buildings/:number',
        name: 'Building Details Page',
        component: BuildingsPage,
        exact: true
    },
]

export default routes;