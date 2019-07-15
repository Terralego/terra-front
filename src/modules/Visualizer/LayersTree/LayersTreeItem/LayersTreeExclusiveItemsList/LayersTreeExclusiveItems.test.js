import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeExclusiveItemsList from './LayersTreeExclusiveItemsList';
import { onChange } from '.';

jest.mock('./Selector', () => () => <p>Selector</p>);

it('should render', () => {
  const tree = renderer.create(
    <>
      <LayersTreeExclusiveItemsList
        layer={{
          layers: [{
            label: 'foo',
          }, {
            label: 'bar',
          }],
        }}
      />
      <LayersTreeExclusiveItemsList
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
      <LayersTreeExclusiveItemsList
        layer={{
          selectors: [{
            label: 'Foo',
            name: 'foo',
            values: ['foo', 'bar'],
          }, {
            label: 'Baar',
            name: 'bar',
            values: ['foo', 'bar'],
          }],
          layers: [{
            label: 'foo',
            selectorKey: {
              foo: 'foo',
              bar: 'foo',
            },
          }, {
            label: 'bar',
            selectorKey: {
              foo: 'foo',
              bar: 'bar',
            },
          }, {
            label: 'foo1',
            selectorKey: {
              foo: 'bar',
              bar: 'foo',
            },
          }, {
            label: 'bar1',
            selectorKey: {
              foo: 'bar',
              bar: 'bar',
            },
          }],
        }}
      />
    </>,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should keep previous state', () => {
  const layers = [{
    label: 'foo1',
  }, {
    label: 'foo2',
  }, {
    label: 'foo3',
  }];
  const setLayerState = jest.fn();

  onChange(layers, setLayerState, () => ({}))(0);
  expect(setLayerState).toHaveBeenCalledTimes(3);
  expect(setLayerState.mock.calls[0][0]).toEqual({
    layer: layers[0],
    state: { active: true },
    reset: true,
  });
  expect(setLayerState.mock.calls[1][0]).toEqual({
    layer: layers[1],
    state: { active: false },
    reset: true,
  });
  expect(setLayerState.mock.calls[2][0]).toEqual({
    layer: layers[2],
    state: { active: false },
    reset: true,
  });
  setLayerState.mockClear();

  onChange(layers, setLayerState, () => ({}))(1);
  expect(setLayerState).toHaveBeenCalledTimes(3);
  expect(setLayerState.mock.calls[0][0]).toEqual({
    layer: layers[0],
    state: { active: false },
    reset: true,
  });
  expect(setLayerState.mock.calls[1][0]).toEqual({
    layer: layers[1],
    state: { active: true },
    reset: true,
  });
  expect(setLayerState.mock.calls[2][0]).toEqual({
    layer: layers[2],
    state: { active: false },
    reset: true,
  });
  setLayerState.mockClear();

  onChange(layers, setLayerState, ({ layer }) => (layer === layers[0]
    ? { active: true, table: true }
    : {}))(2);
  expect(setLayerState).toHaveBeenCalledTimes(3);
  expect(setLayerState.mock.calls[0][0]).toEqual({
    layer: layers[0],
    state: { active: false },
    reset: true,
  });
  expect(setLayerState.mock.calls[1][0]).toEqual({
    layer: layers[1],
    state: { active: false },
    reset: true,
  });
  expect(setLayerState.mock.calls[2][0]).toEqual({
    layer: layers[2],
    state: { active: true, table: true },
    reset: true,
  });
  setLayerState.mockClear();
});
