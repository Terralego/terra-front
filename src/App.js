import React, { Component } from 'react';

import settings from 'front-settings';

import {
  Breadcrumb,
  LocaleProvider,
  Layout,
} from 'antd';

import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';

import Header from 'components/Header/Header';
import SideMenu from 'components/SideMenu/SideMenu';
import Main from 'components/Main/Main';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';

class App extends Component {
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

            <Breadcrumb style={{ margin: '20px' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
              <Breadcrumb.Item>{settings.foo}</Breadcrumb.Item>
            </Breadcrumb>

            <Main />

          </Layout>

        </Layout>

        <Layout.Footer>Footer content</Layout.Footer>

      </Layout>
    );
  }
}

const AppWrapper = () => (
  <LocaleProvider locale={fr}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </LocaleProvider>
);

export default AppWrapper;
