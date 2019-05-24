import React from 'react';
import renderer from 'react-test-renderer';

import LayersTreeProvider from './LayersTreeProvider';
import { connectLayersTree } from './context';
import { setLayerStateAction, selectSublayerAction, initLayersStateAction } from '../../services/layersTreeUtils';

jest.mock('../../services/layersTreeUtils', () => ({
  initLayersStateAction: jest.fn(),
  selectSublayerAction: jest.fn(),
  setLayerStateAction: jest.fn(),
}));

beforeEach(() => {
  initLayersStateAction.mockClear();
  selectSublayerAction.mockClear();
  setLayerStateAction.mockClear();
});

it('should render', () => {
  const layersTreeConfig = [{
    id: 'foo',
  }];
  const Test = connectLayersTree('layersTree')(({ layersTree }) => (
    <>
      {layersTree.map(({ id }) => <p key={id}>{id}</p>)}
    </>
  ));
  const tree = renderer.create(
    <LayersTreeProvider layersTree={layersTreeConfig}>
      <Test />
    </LayersTreeProvider>,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should update', () => {
  const instance = new LayersTreeProvider({});
  instance.resetLayerState = jest.fn();
  instance.initLayersState = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.resetLayerState).not.toHaveBeenCalled();
  expect(instance.initLayersState).not.toHaveBeenCalled();

  instance.props.initialState = {};
  instance.componentDidUpdate({ });
  expect(instance.resetLayerState).toHaveBeenCalledWith(instance.props.initialState);

  instance.props.layersTree = [];
  instance.componentDidUpdate({ });
  expect(instance.initLayersState).toHaveBeenCalledWith();
});

it('should unmount', () => {
  const instance = new LayersTreeProvider({});
  expect(instance.isUnmount).not.toBeDefined();
  instance.componentWillUnmount();
  expect(instance.isUnmount).toBe(true);
});

it('should set layer state', () => {
  const instance = new LayersTreeProvider({});
  instance.resetLayerState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const state = {};
  layersTreeState.set(layer, state);
  instance.state.layersTreeState = layersTreeState;
  instance.setLayerState({ layer, state });
  expect(instance.resetLayerState).toHaveBeenCalled();
  expect(setLayerStateAction).toHaveBeenCalledWith(layer, state, layersTreeState);
});

it('should get layer state', () => {
  const instance = new LayersTreeProvider({});
  const layer = {};
  const state = {
    active: true,
  };
  const layersTreeState = new Map();
  layersTreeState.set(layer, state);
  instance.state = { layersTreeState };
  expect(instance.getLayerState({ layer })).toBe(state);
  expect(instance.getLayerState({ layer: {} })).toEqual({});
});

it('should select sublayer', () => {
  const instance = new LayersTreeProvider({});
  instance.resetLayerState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const sublayer = {};
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;
  instance.selectSublayer({ layer, sublayer });
  expect(instance.resetLayerState).toHaveBeenCalled();
  expect(selectSublayerAction).toHaveBeenCalledWith(layer, sublayer, layersTreeState);
});

it('should fetch property values', async () => {
  const values = ['foo', 'bar'];
  const fetchPropertyValues = jest.fn(() => values);
  const instance = new LayersTreeProvider({ fetchPropertyValues });
  instance.resetLayerState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const property = {};
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;

  const wait = instance.fetchPropertyValues(layer, property);
  expect(property.values).toEqual([]);
  expect(instance.resetLayerState).toHaveBeenCalledWith(expect.any(Map));
  instance.resetLayerState.mockClear();
  expect(fetchPropertyValues).toHaveBeenCalledWith(layer, property);

  await wait;
  expect(property.values).toEqual(values);
  expect(instance.resetLayerState).toHaveBeenCalledWith(expect.any(Map));

  instance.props.fetchPropertyValues = jest.fn();
  await instance.fetchPropertyValues(layer, property);
  expect(property.values).toEqual([]);
});

it('should fetch property ranges', async () => {
  const fetchPropertyRange = jest.fn(() => ({ min: 2, max: 42 }));
  const instance = new LayersTreeProvider({ fetchPropertyRange });
  instance.resetLayerState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const property = {};
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;

  const wait = instance.fetchPropertyRange(layer, property);
  expect(property.min).toBe(0);
  expect(property.max).toBe(100);
  expect(instance.resetLayerState).toHaveBeenCalledWith(expect.any(Map));
  instance.resetLayerState.mockClear();
  expect(fetchPropertyRange).toHaveBeenCalledWith(layer, property);

  await wait;
  expect(property.min).toBe(2);
  expect(property.max).toBe(42);
  expect(instance.resetLayerState).toHaveBeenCalledWith(expect.any(Map));

  instance.props.fetchPropertyRange = jest.fn();
  await instance.fetchPropertyRange(layer, property);
  expect(property.min).toBe(0);
  expect(property.max).toBe(100);
});

it('should init layers state', () => {
  const instance = new LayersTreeProvider({ initialState: new Map() });
  instance.resetLayerState = jest.fn();
  instance.initLayersState();
  expect(instance.resetLayerState).not.toHaveBeenCalled();

  instance.props.layersTree = [];
  instance.initLayersState();
  expect(initLayersStateAction).toHaveBeenCalledWith(instance.props.layersTree);
  expect(instance.resetLayerState).toHaveBeenCalled();
  expect(instance.resetLayerState).not.toHaveBeenCalledWith(instance.state.layersTreeState);
  initLayersStateAction.mockClear();
  instance.resetLayerState.mockClear();

  instance.state.layersTreeState.set({}, {});
  instance.initLayersState();
  expect(initLayersStateAction).not.toHaveBeenCalled();
  expect(instance.resetLayerState).toHaveBeenCalledWith(instance.state.layersTreeState);
});
