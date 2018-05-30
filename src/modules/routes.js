import Home from 'components/Home/Home';
import About from 'components/About/About';
import Form from 'components/Form/Form';
import ManageRequests from 'components/ManageRequests/ManageRequests';
import ManageRequestDetail from 'components/ManageRequests/ManageRequestDetail';
import Login from 'components/Login/Login';

export const routes = [{
  path: '/',
  name: 'Home',
  component: Home,
  icon: 'home',
  exact: true,
  protected: false,
}, {
  path: '/about',
  name: 'About',
  component: About,
  icon: 'paper-clip',
  protected: false,
}, {
  path: '/request',
  name: 'Request',
  component: Form,
  icon: 'form',
  protected: false,
}, {
  path: '/manage-request',
  name: 'Manage requests',
  component: ManageRequests,
  icon: 'form',
  exact: true,
  protected: true,
  routes: [
    {
      path: '/manage-request/detail/:id',
      name: 'Manage request detail',
      component: ManageRequestDetail,
      protected: true,
    },
  ],
}, {
  path: '/login',
  name: 'Login',
  component: Login,
  icon: 'form',
}];

export default routes;
