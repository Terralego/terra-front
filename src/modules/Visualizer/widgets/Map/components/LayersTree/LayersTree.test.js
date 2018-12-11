import React from 'react';
import renderer from 'react-test-renderer';
import LayersTree from './LayersTree';

jest.mock('@blueprintjs/core', () => ({
  Card ({ children }) {
    return children;
  },
  Classes: { DARK: 'dark' },
}));
jest.mock('./LayersTreeGroup', () => function LayersTreeGroup () {
  return <p>LayersTreeGroup</p>;
});
jest.mock('./LayersTreeItem', () => function LayersTreeItem () {
  return <p>LayersTreeItem</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <LayersTree
      layersTree={[{
        group: 'Group 1',
        layers: [{
          label: 'Layer 1',
        }, {
          label: 'Layer 2',
        }],
      }, {
        label: 'With sublayers',
        sublayers: [{
          label: 'sublayer 1',
        }, {
          label: 'sublayer 2',
        }],
      }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
