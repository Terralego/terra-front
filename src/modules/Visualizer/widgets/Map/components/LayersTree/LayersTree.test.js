import React from 'react';
import renderer from 'react-test-renderer';
import { LayersTree } from './LayersTree';


it('should render correctly', () => {
  const layersTree = [{
    label: 'foo',
    active: {
      layouts: [{
        id: 'foo',
        visibility: 'visible',
      }],
    },
    inactive: {
      layouts: [{
        id: 'foo',
        visibility: 'none',
      }],
    },
  }, {
    label: 'bar',
    active: {
      layouts: [{
        id: 'bar',
        visibility: 'visible',
      }],
    },
    inactive: {
      layouts: [{
        id: 'bar',
        visibility: 'none',
      }],
    },
  }];
  const tree = renderer.create((
    <LayersTree
      layersTree={layersTree}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should change on toggle', () => {
  const onChange = jest.fn();
  const layer = {
    active: {},
    inactive: {},
  };
  const instance = new LayersTree({ onChange, layersTree: [] }, {});

  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith(layer.active);
  expect(layer.isActive).toBe(true);

  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith(layer.inactive);
  expect(layer.isActive).toBe(false);
});
