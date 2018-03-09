import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import settings from 'front-settings';

import {
  Breadcrumb,
  LocaleProvider,
  Layout,
} from 'antd';

import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';

import Header from 'components/Header/Header';
import Home from 'components/Home/Home';
import About from 'components/About/About';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';


const { Content, Footer } = Layout;

class Main extends Component {
  componentDidMount () {
    // componentDidMount
  }

  render () {
    return (
      <Layout>

        <Header />

        <Content style={{ padding: '0 50px' }}>

          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
            <Breadcrumb.Item>{settings.foo}</Breadcrumb.Item>
          </Breadcrumb>

          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />

        </Content>

        <Footer>
          Footer text
        </Footer>

      </Layout>
    );
  }
}

const App = () => (
  <LocaleProvider locale={fr}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Main />
      </ConnectedRouter>
    </Provider>
  </LocaleProvider>
);

export default App;
