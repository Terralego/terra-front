import React from 'react';
import { Link } from 'react-router-dom';

import { Icon, Menu } from 'antd';

const SideMenu = () => (
  <Menu mode="inline" defaultSelectedKeys={['1']} >

    <Menu.SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
      <Menu.Item key="1"><Link to="/"><Icon type="home" />Home</Link></Menu.Item>
      <Menu.Item key="2"><Link to="/about"><Icon type="paper-clip" />About</Link></Menu.Item>
      <Menu.Item key="3">option3</Menu.Item>
      <Menu.Item key="4">option4</Menu.Item>
    </Menu.SubMenu>

    <Menu.SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
      <Menu.Item key="5">option5</Menu.Item>
      <Menu.Item key="6">option6</Menu.Item>
      <Menu.Item key="7">option7</Menu.Item>
      <Menu.Item key="8">option8</Menu.Item>
    </Menu.SubMenu>

    <Menu.SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
      <Menu.Item key="9">option9</Menu.Item>
      <Menu.Item key="10">option10</Menu.Item>
      <Menu.Item key="11">option11</Menu.Item>
      <Menu.Item key="12">option12</Menu.Item>
    </Menu.SubMenu>

  </Menu>
);

export default SideMenu;
