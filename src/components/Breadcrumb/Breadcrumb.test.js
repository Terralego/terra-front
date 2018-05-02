import { getCurrentRoutes } from './Breadcrumb';

const routes = [{
  path: '/form',
  name: 'Formulaire',
  icon: 'form',
}, {
  path: '/sub1',
  name: 'Subnav 1',
  routes: [
    {
      path: '/option1',
      name: 'Option 1',
    }, {
      path: '/option2',
      name: 'Option 2',
    },
  ],
}];

const location = {
  pathname: '/sub1',
  search: '',
  hash: '',
  key: 't55thq',
};

describe('Breadcrumb', () => {
  it('should have a valid router object', () => {
    const currentRoutes = getCurrentRoutes(routes, location);
    expect(currentRoutes).toEqual(routes);
  });
});

