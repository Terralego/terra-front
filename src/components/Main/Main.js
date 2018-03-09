import React from 'react';
import { Route } from 'react-router-dom';

import { Layout } from 'antd';

import Home from 'components/Home/Home';
import About from 'components/About/About';

const componentName = () => (
  <Layout.Content style={{ margin: '0 20px', padding: '20px', background: 'white' }}>
    <Route exact path="/" component={Home} />
    <Route exact path="/about" component={About} />
  </Layout.Content>
);

export default componentName;
