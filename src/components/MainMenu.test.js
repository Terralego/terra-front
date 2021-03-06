import React from 'react';
import renderer from 'react-test-renderer';

import { MainMenu } from './MainMenu';
import login from '../images/log-in.svg';
import logout from '../images/log-out.svg';
import infosign from '../images/info-sign.svg';

jest.mock('./NavBarItemDesktop', () => () => 'NavBarItemDesktop');
jest.mock('./NavBarItemTablet', () => () => 'NavBarItemTablet');

it('should render properly', () => {
  const tree = renderer.create(
    <MainMenu
      navItems={[[
        { label: 'log in', icon: login, id: 'login' },
        { label: 'log out', icon: logout, id: 'logout' },
        { label: 'info sign', icon: infosign, id: 'infosign' },
      ]]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render properly with custom component', () => {
  const tree = renderer.create(
    <MainMenu
      navItems={[[
        { component: () => <button type="button">click me</button>, id: 'button' },
        { component: () => <img src={login} alt="login logo" />, id: 'login' },
        { component: () => <div>check me<input type="checkbox" /></div>, id: 'checkbox' },
        { component: () => <div>search me<input type="text" /></div>, id: 'text' },
      ]]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});


it('should render properly with navHeader props', () => {
  const tree = renderer.create(
    <MainMenu
      navHeader={{ label: 'log in', icon: login }}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
