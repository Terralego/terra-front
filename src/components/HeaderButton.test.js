import React from 'react';
import renderer from 'react-test-renderer';
import { HeaderButton } from './HeaderButton';

import defaultLogo from '../images/defaultLogo.svg';

it('should render correctly', () => {
  const tree = renderer.create(
    <HeaderButton
      id="theme"
      icon={defaultLogo}
      alt="default logo"
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
