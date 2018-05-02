import React,  { Component } from 'react';

import { Layout } from 'antd';

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

            <ComponentName />

          </Layout>

        </Layout>

        <Layout.Footer>Footer content</Layout.Footer>

      </Layout>
    );
  }
}

const ComponentName = () => (
  <Layout.Content style={{ margin: '0 20px', padding: '20px', background: 'white' }}>
    {routes.map(route => <RouteWithSubRoutes key={`route_${route.path}`} {...route} />)}
  </Layout.Content>
);

export default Main;
