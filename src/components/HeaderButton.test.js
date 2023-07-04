import React from 'react';
import renderer from 'react-test-renderer';
import { Icon } from '@blueprintjs/core';
import { HeaderButton } from './HeaderButton';

import defaultLogo from '../images/defaultLogo.svg';

it('should render correctly with Icon path', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      icon={defaultLogo}
      alt="default logo"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with Icon keyword', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      icon="log-in"
      alt="Login"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with Icon component', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      icon={<Icon icon="info-sign" />}
      alt="InfoSign"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly without icon', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      alt="default logo"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should not render a button if an html component is provided', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      alt="default logo"
      component="span"
    />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
