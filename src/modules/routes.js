import Home from 'components/Home/Home';
import About from 'components/About/About';
import Form from 'components/Form/Form';
import ManageRequests from 'components/ManageRequests/ManageRequests';

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
}, {
  path: '/sub1',
  name: 'Subnav 1',
  exact: true,
  component: Form,
  routes: [
    {
      path: '/sub1/option1',
      name: 'Option 1',
      component: Form,
    }, {
      path: '/sub1/option2',
      name: 'Option 2',
      component: Form,
    },
  ],
}];

export default routes;
