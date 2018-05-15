import Home from 'components/Home/Home';
import About from 'components/About/About';
import Form from 'components/Form/Form';
import ManageRequests from 'components/ManageRequests/ManageRequests';
import Summary from 'components/Summary/Summary';

export const routes = [{
  path: '/accueil',
  name: 'Accueil',
  component: Home,
  icon: 'home',
  exact: true,
}, {
  path: '/a-propos',
  name: 'À propos',
  component: About,
  icon: 'paper-clip',
}, {
  path: '/demande',
  name: 'Demande',
  component: Form,
  icon: 'form',
}, {
  path: '/gestion-demandes',
  name: 'Gestion des demandes',
  component: ManageRequests,
  icon: 'form',
  exact: true,
  routes: [
    {
      path: '/gestion-demandes/detail/:id',
      name: 'Détail de la demande',
      component: Summary,
    },
  ],
}];

export default routes;
