import React from 'react';
import { Link } from 'react-router-dom';
import settings from 'front-settings';

import {
  Icon,
  Layout,
  Menu,
  Popconfirm,
} from 'antd';

import Logo from 'components/Logo/Logo';
import styles from './Header.module.scss';

const HeaderBrand = () => (
  <div className={styles.brand}>
    <img src={Logo} alt="Logo" style={{ height: '70%', width: 'auto', marginRight: 10 }} />
    {settings.title}
  </div>
);

const Header = () => (
  <Layout.Header className={styles.header}>

    <HeaderBrand />

    <Menu
      theme="dark"
      className={styles.menu}
      mode="horizontal"
      style={{ lineHeight: '64px' }}
    >

      <Menu.SubMenu title={<span><Icon type="user" />Mon compte</span>}>
        <Menu.ItemGroup title="Prénom Nom">
          <Menu.Item key="account">Account</Menu.Item>
          <Menu.Item key="settings">Settings</Menu.Item>
        </Menu.ItemGroup>
      </Menu.SubMenu>

      <Menu.Item>
        <Popconfirm title="Êtes-vous sûr ?" okText="Oui" cancelText="Non">
          <Link to="/logout"><Icon type="logout" />Se déconnecter</Link>
        </Popconfirm>
      </Menu.Item>
    </Menu>

  </Layout.Header>
);

export default Header;
