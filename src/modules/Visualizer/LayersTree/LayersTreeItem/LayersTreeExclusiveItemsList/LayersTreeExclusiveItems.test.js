import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeEclusiveItems from './LayersTreeExclusiveItemsList';

it('should render', () => {
  const tree = renderer.create(
    <>
      <LayersTreeEclusiveItems
        layer={{
          layers: [{
            label: 'foo',
          }, {
            label: 'bar',
          }],
        }}
      />
      <LayersTreeEclusiveItems
        layer={{
          layers: [{
            label: 'foo',
          }, {
            label: 'bar',
          }, {
            label: 'foo1',
          }, {
            label: 'bar1',
          }, {
            label: 'foo2',
          }, {
            label: 'bar2',
          }, {
            label: 'foo3',
          }, {
            label: 'bar3',
          }],
        }}
      />
    </>,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});
