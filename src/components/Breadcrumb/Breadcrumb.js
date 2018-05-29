import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import { Breadcrumb as BreadcrumbAnt } from 'antd';
import routes from 'modules/routes';

/**
 * Generate breadcrumb routes array
 * @param  {array} allRoutes
 * @param  {string} currentPath
 * @param  {object} defaultRoute
 */
export const getBreadcrumbRoutes = (allRoutes, currentPath, defaultRoute) => {
  const breadcrumbRoutes = [];
  if (defaultRoute) {
    breadcrumbRoutes.push(defaultRoute);
  }
  if (currentPath) {
    const parents = currentPath.split('/').filter(item => item !== '');

    allRoutes.filter(route => route.path.split('/')
      .filter(pathName => parents.indexOf(pathName) !== -1).length > 0)
      .map(item => {
        if (!defaultRoute || item.path !== defaultRoute.path) {
          breadcrumbRoutes.push({ path: item.path, name: item.name });
        }
        if (item.routes) {
          const childPath = currentPath.replace(item.path, '');
          breadcrumbRoutes.push(...getBreadcrumbRoutes(item.routes, childPath));
        }
        return item;
      });
  }

  return breadcrumbRoutes;
};

const BreadcrumbItem = route => {
  const link = routes.find(r => r.path === route.path);
  return !link ? <span>{route.name}</span> : <Link to={route.path}>{route.name}</Link>;
};


const Breadcrumb = ({ location }) => (
  <BreadcrumbAnt
    style={{ margin: '20px' }}
    itemRender={BreadcrumbItem}
    routes={getBreadcrumbRoutes(routes, location.pathname, routes[0])}
  />
);

const DispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch,
  );

export default withRouter(connect(null, DispatchToProps)(Breadcrumb));
