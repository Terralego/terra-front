import React from 'react';
import renderer from 'react-test-renderer';
import { HeaderLink } from './HeaderLink';

jest.mock('react-router-dom', () => ({
  NavLink: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

it('should render correctly with no href', () => {
  const tree = renderer.create(
    <HeaderLink>
      <span>Test</span>
    </HeaderLink>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});


it('should render correctly with http link', () => {
  const tree = renderer.create(
    <HeaderLink href="https://foo.com">
      <span>Foo</span>
    </HeaderLink>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly with navigation', () => {
  const tree = renderer.create(
    <HeaderLink href="foo">
      <span>Bar</span>
    </HeaderLink>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
