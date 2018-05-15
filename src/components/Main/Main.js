import React,  { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'react-redux';

import routes from 'modules/routes';
import Header from 'components/Header/Header';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SideMenu from 'components/SideMenu/SideMenu';
import RouteWithSubRoutes from 'components/RouteWithSubRoutes/RouteWithSubRoutes';

class Main extends Component {
  componentDidMount () {
    // componentDidMount
  }

  render () {
    // Concatenate all routes for child views
    const routesViews = [...routes];
    routes.forEach(route => {
      if (route.routes) {
        routesViews.push(...route.routes);
      }
    });

    return (
      <Layout style={{ height: '100vh' }}>

        <Header />

        <Layout>
          <Layout.Sider
            breakpoint="md"
            collapsedWidth="0"
            style={{ background: 'white' }}
          >
            <SideMenu />
          </Layout.Sider>

          <Layout>

            <Breadcrumb />

            <Layout.Content style={{ margin: '0 20px', padding: '20px', background: 'white' }}>
              {routesViews.map(route => <RouteWithSubRoutes key={`route_${route.path}`} {...route} />)}
            </Layout.Content>

          </Layout>

        </Layout>

        <Layout.Footer>Footer content</Layout.Footer>

      </Layout>
    );
  }
}

const StateToProps = state => ({
  location: state.routing.location,
});

export default connect(StateToProps, {})(Main);
