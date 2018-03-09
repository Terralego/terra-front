import React from 'react';
import { Link } from 'react-router-dom';

import {
  Icon,
  Layout,
  Menu,
  Popconfirm,
} from 'antd';

const Header = () => {
  return (
    <Layout.Header>

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

    </Layout.Header>
  );
};

export default Header;
