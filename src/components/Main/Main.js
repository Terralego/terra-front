import React from 'react';
import { Layout } from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { logoutUser } from 'modules/authentication';
import Header from 'components/Header/Header';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SideMenu from 'components/SideMenu/SideMenu';
import RouteViews from 'components/RouteViews/RouteViews';

const Main = props => (
  <Layout style={{ height: '100vh' }}>
    <Header {...this.props} />
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
          <RouteViews {...props} />
        </Layout.Content>
      </Layout>
    </Layout>

    <Layout.Footer>Footer content</Layout.Footer>
  </Layout>
);

const StateToProps = state => ({
  location: state.routing.location,
  isAuthenticated: state.authentication.isAuthenticated,
});

const DispatchToProps = dispatch =>
  bindActionCreators({ logoutUser }, dispatch);

export default connect(StateToProps, DispatchToProps)(Main);
