import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import routes from 'modules/routes';


export default props => {
  // wrap <Route> and use this everywhere instead, then when
  // sub routes are added to any route it'll work
  const RouteWithSubRoutes = route => (
    route.protected ?
      <Route
        exact={route.exact}
        path={route.path}
        render={() => (
          props.isAuthenticated
          ? <route.component {...props} routes={route.routes} />
          : <Redirect
            to={{ pathname: '/login', state: { from: props.location.pathname } }}
            from={props.location.pathname}
          />
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

  return routesViews.map(route => <RouteWithSubRoutes key={`route_${route.path}`} {...route} />);
};
