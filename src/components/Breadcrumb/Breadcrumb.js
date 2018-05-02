import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Breadcrumb as BreadcrumbAnt } from 'antd';
import routes from 'modules/routes';

export const getCurrentRoutes = (allRoutes, currentLocation) => {
  return allRoutes;
};

const BreadcrumbItem = route => {
  const last = routes.indexOf(route) === routes.length - 1;
  return last ? <span>{route.name}</span> : <Link to={route.path}>{route.name}</Link>;
};

const Breadcrumb = ({ location }) => (
  <BreadcrumbAnt
    style={{ margin: '20px' }}
    itemRender={BreadcrumbItem}
    routes={getCurrentRoutes(routes, location)}
  />
);

const StateToProps = state => ({
  location: state.routing.location,
});

const DispatchToProps = dispatch =>
  bindActionCreators(
    {},
    dispatch,
  );

export default connect(StateToProps, DispatchToProps)(Breadcrumb);
