import React from 'react';
import renderer from 'react-test-renderer';
import { NavBarItemTablet } from './NavBarItemTablet';

jest.mock('./HeaderButton', () => () => 'HeaderButton');
jest.mock('./HeaderLink', () => ({ children }) => (
  <div title="headerlink">
    {children}
  </div>
));

it('should render correctly the component', () => {
  const tree = renderer.create(
    <NavBarItemTablet href="visualiser" id="test" />,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
