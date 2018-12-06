import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
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
    id: 'foo',
  };
  const instance = new LayersTree({ onChange }, {});
  jest.spyOn(instance.state.areActives, 'add');
  jest.spyOn(instance.state.areActives, 'delete');
  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith({ layer, state: { active: true } });
  expect(instance.isActive(layer)).toBe(true);
  // expect(instance.state.areActives)

  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith({ layer, state: { active: false } });
  expect(instance.isActive(layer)).toBe(false);

  instance.onToggleChange(layer)();
  expect(onChange).toHaveBeenCalledWith({ layer, state: { active: true } });
  expect(instance.isActive(layer)).toBe(true);
});

it('should set initial state', () => {
  const instance = new LayersTree({ layersTree: [] }, {});
  expect(instance.state.areActives).toEqual(new Set());

  const widget = { type: 'map', initialState: { active: true } };
  const instance2 = new LayersTree({ layersTree: [widget] }, {});
  expect(instance2.state.areActives).toEqual(new Set([widget]));
});
