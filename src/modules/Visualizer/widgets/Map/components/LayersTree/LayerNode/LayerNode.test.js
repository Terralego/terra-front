import React from 'react';
import renderer from 'react-test-renderer';
import LayersNode from '.';

it('should render correctly', () => {
  const tree = renderer.create((
    <>
      <LayersNode
        LayersTree={[]}
      />
      <LayersNode
        LayersTree={[]}
        isActive
      />
    </>
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
