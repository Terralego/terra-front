import { getBreadcrumbRoutes } from './Breadcrumb';

const routes = [{
  path: '/home',
  name: 'Home',
}, {
  path: '/sub1',
  name: 'Subnav 1',
  routes: [
    {
      path: '/sub1/option1',
      name: 'Option 1',
    }, {
      path: '/sub1/option2',
      name: 'Option 2',
    },
  ],
}];

describe('Breadcrumb', () => {
  it('should have a valid router object', () => {

    const expected = [{
      path: '/sub1',
      name: 'Subnav 1',
    }, {
      path: '/sub1/option1',
      name: 'Option 1',
    }];

    const currentRoutes = getBreadcrumbRoutes(routes, '/sub1/option1');
    expect(currentRoutes).toEqual(expected);
  });

  it('should have a valid router object', () => {

    const expected = [{
      path: '/home',
      name: 'Home',
    }, {
      path: '/sub1',
      name: 'Subnav 1',
    }, {
      path: '/sub1/option1',
      name: 'Option 1',
    }];

    const currentRoutes = getBreadcrumbRoutes(routes, '/sub1/option1', routes[0]);
    expect(currentRoutes).toEqual(expected);
  });
});

