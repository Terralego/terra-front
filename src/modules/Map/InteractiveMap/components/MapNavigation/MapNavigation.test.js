import React from 'react';
import renderer from 'react-test-renderer';
import MapNavigation from './MapNavigation';

jest.mock('@blueprintjs/core', () => ({
  Card ({ children }) {
    return children;
  },
  Button () {
    return 'LayerTree Button';
  },
  Tooltip  ({ children }) {
    return children;
  },
  Classes: { DARK: 'dark' },
}));
jest.mock('../LayersTree', () => function LayersTree () {
  return <p>LayersTree</p>;
});


it('should render correctly', () => {
  Math.random = () => 1;
  Date.now = () => 66;
  const tree = renderer.create((
    <>
      <MapNavigation />
      <MapNavigation isVisible />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
