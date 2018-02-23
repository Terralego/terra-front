import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import {
  Breadcrumb,
  Icon,
  LocaleProvider,
  Layout,
  Menu,
  Popconfirm,
} from 'antd';

import fr from 'antd/lib/locale-provider/fr_FR';
import 'moment/locale/fr';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { store, history } from './store';

const { Header, Content, Footer } = Layout;

const Home  = () => <div>Home content</div>;
const About = () => <div>About content</div>;

class Main extends Component {
  componentDidMount () {
    // componentDidMount
  }

  render () {
    return (
      <Layout>

        <Header>

          <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }} >
            <Menu.Item>
              <Link to="/">
                <Icon type="home" />Home
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link to="/about">
                <Icon type="paper-clip" />About
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Popconfirm title="Êtes-vous sûr ?" okText="Oui" cancelText="Non">
                <Link to="/logout">
                  <Icon type="logout" />Se déconnecter
                </Link>
              </Popconfirm>
            </Menu.Item>
          </Menu>

        </Header>

        <Content style={{ padding: '0 50px' }}>

          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
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
