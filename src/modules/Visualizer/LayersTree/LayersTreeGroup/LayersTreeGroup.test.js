import React from 'react';
import renderer from 'react-test-renderer';
import LayersTreeGroup from './LayersTreeGroup';

jest.mock('@blueprintjs/core', () => ({
  H5 ({ children }) {
    return children;
  },
}));
jest.mock('../LayersTreeItem', () => function LayersTreeItem () {
  return <p>LayersTreeItem</p>;
});

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <LayersTreeGroup
        title="Group 1"
        layer={{
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
      />
      <LayersTreeGroup
        title="Group 1"
        layer={{
          layers: [{
            label: 'Layer 1',
          }, {
            label: 'Layer 2',
          }],
        }}
        isHidden
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
