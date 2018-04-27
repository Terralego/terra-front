import React,  { Component } from 'react';
import { Route } from 'react-router-dom';

import { Layout, Breadcrumb } from 'antd';

import Home from 'components/Home/Home';
import About from 'components/About/About';

import Header from 'components/Header/Header';
import SideMenu from 'components/SideMenu/SideMenu';
import Form from 'components/Form/Form';
import settings from 'front-settings';

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

            <Breadcrumb style={{ margin: '20px' }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
              <Breadcrumb.Item>{settings.foo}</Breadcrumb.Item>
            </Breadcrumb>

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
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
    <Route exact path="/form" component={Form} />
  </Layout.Content>
);

export default Main;
