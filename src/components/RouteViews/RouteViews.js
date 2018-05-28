import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import routes from 'modules/routes';

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = ({ route, ...props }) => (
  route.protected ?
    <Route
      exact={route.exact}
      path={route.path}
      render={() => (
        props.isAuthenticated
        ? <route.component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )}
    />
    : <Route
      exact={route.exact}
      path={route.path}
      render={() => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
);

// Concatenate all routes for child views
const routesViews = [...routes];
routes.forEach(route => {
  if (route.routes) {
    routesViews.push(...route.routes);
  }
});

export default props => routesViews.map(route => <RouteWithSubRoutes {...props} key={`route_${route.path}`} route={route} />);
