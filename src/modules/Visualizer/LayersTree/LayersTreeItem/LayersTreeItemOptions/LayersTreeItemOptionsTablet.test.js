import React from 'react';
import renderer from 'react-test-renderer';
import LayersTreeItemOptionsTablet from '.';

jest.mock('@blueprintjs/core', () => ({
  Button: () => <p>Button</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <LayersTreeItemOptionsTablet />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
