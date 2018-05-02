import Home from 'components/Home/Home';
import About from 'components/About/About';
import Form from 'components/Form/Form';

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
  path: '/form',
  name: 'Formulaire',
  component: Form,
  icon: 'form',
}, {
  path: '/sub1',
  name: 'Subnav 1',
  routes: [
    {
      path: '/option1',
      name: 'Option 1',
      component: Form,
    }, {
      path: '/option2',
      name: 'Option 2',
      component: Form,
    },
  ],
}];

export default routes;
