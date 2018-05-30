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
    {settings.TITLE}
  </div>
);

const Header = props => (
  <Layout.Header className={styles.header}>

    <HeaderBrand />

    {props.isAuthenticated ?
      <Menu
        theme="dark"
        className={styles.menu}
        mode="horizontal"
        style={{ lineHeight: '64px' }}
      >
        <Menu.SubMenu title={<span><Icon type="user" />Mon compte</span>}>
          <Menu.ItemGroup title="Prénom Nom">
            <Menu.Item key="account"><Icon type="setting" /> Profil</Menu.Item>
            <Menu.Item key="manage-request"><Link to="/manage-request"><Icon type="file-text" />Mes demandes</Link></Menu.Item>
            <Menu.Item key="request"><Link to="/request"><Icon type="file-add" /> Créer une demande</Link></Menu.Item>
          </Menu.ItemGroup>
        </Menu.SubMenu>
        <Menu.Item>
          <Popconfirm
            title="Êtes-vous sûr ?"
            okText="Oui"
            cancelText="Non"
            onConfirm={props.logout}
          >
            <Icon type="logout" />Se déconnecter
          </Popconfirm>
        </Menu.Item>
      </Menu>
      :
      <Menu
        theme="dark"
        className={styles.menu}
        mode="horizontal"
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item>
          <Link to="/login"><Icon type="login" />Se connecter</Link>
        </Menu.Item>
      </Menu>
    }

  </Layout.Header>
);

export default Header;
