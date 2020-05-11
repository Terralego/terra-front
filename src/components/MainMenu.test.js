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
        { label: 'log in', icon: login },
        { label: 'log out', icon: logout },
        { label: 'info sign', icon: infosign },
      ]]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render properly on mobile size', () => {
  const tree = renderer.create(
    <MainMenu
      isMobileSized
      navItems={[[
        { label: 'log in', icon: login },
        { label: 'log out', icon: logout },
        { label: 'info sign', icon: infosign },
      ]]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render properly with custom component', () => {
  const tree = renderer.create(
    <MainMenu
      navItems={[[
        { component: () => <button type="button">click me</button> },
        { component: () => <img src={login} alt="login logo" /> },
        { component: () => <div>check me<input type="checkbox" /></div> },
        { component: () => <div>search me<input type="text" /></div> },
      ]]}
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
