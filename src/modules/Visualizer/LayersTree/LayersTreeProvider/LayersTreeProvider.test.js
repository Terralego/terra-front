import React from 'react';
import renderer from 'react-test-renderer';

import { LayersTreeProvider } from './LayersTreeProvider';
import { connectLayersTree } from './context';
import { setLayerStateAction, initLayersStateAction } from '../../services/layersTreeUtils';

jest.mock('../../services/layersTreeUtils', () => ({
  initLayersStateAction: jest.fn(),
  setLayerStateAction: jest.fn(),
}));

beforeEach(() => {
  initLayersStateAction.mockClear();
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
  instance.resetState = jest.fn();
  instance.initLayersState = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.resetState).not.toHaveBeenCalled();
  expect(instance.initLayersState).not.toHaveBeenCalled();

  instance.props.initialState = {};
  instance.componentDidUpdate({ });
  expect(instance.initLayersState).toHaveBeenCalledWith(instance.props.initialState);

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
  instance.resetState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const state = {};
  layersTreeState.set(layer, state);
  instance.state.layersTreeState = layersTreeState;
  instance.setLayerState({ layer, state });
  expect(instance.resetState).toHaveBeenCalled();
  instance.resetState.mock.calls[0][0]({ layersTreeState });
  expect(setLayerStateAction).toHaveBeenCalledWith(layer, state, layersTreeState, undefined);
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

it('should fetch property values', async () => {
  const values = ['foo', 'bar'];
  const fetchPropertyValues = jest.fn(() => values);
  const instance = new LayersTreeProvider({ fetchPropertyValues });
  instance.resetState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const property = {};
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;

  const wait = instance.fetchPropertyValues(layer, property);
  expect(property.values).toEqual([]);
  expect(instance.resetState).toHaveBeenCalledWith(expect.any(Map));
  instance.resetState.mockClear();
  expect(fetchPropertyValues).toHaveBeenCalledWith(layer, property);

  await wait;
  expect(property.values).toEqual(values);
  expect(instance.resetState).toHaveBeenCalledWith(expect.any(Map));

  instance.props.fetchPropertyValues = jest.fn();
  await instance.fetchPropertyValues(layer, property);
  expect(property.values).toEqual([]);
});

it('should fetch property ranges', async () => {
  const fetchPropertyRange = jest.fn(() => ({ min: 2, max: 42 }));
  const instance = new LayersTreeProvider({ fetchPropertyRange });
  instance.resetState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const property = {};
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;

  const wait = instance.fetchPropertyRange(layer, property);
  expect(property.min).toBe(0);
  expect(property.max).toBe(100);
  expect(instance.resetState).toHaveBeenCalledWith(expect.any(Map));
  instance.resetState.mockClear();
  expect(fetchPropertyRange).toHaveBeenCalledWith(layer, property);

  await wait;
  expect(property.min).toBe(2);
  expect(property.max).toBe(42);
  expect(instance.resetState).toHaveBeenCalledWith(expect.any(Map));

  instance.props.fetchPropertyRange = jest.fn();
  await instance.fetchPropertyRange(layer, property);
  expect(property.min).toBe(0);
  expect(property.max).toBe(100);
});

it('should init layers state', () => {
  const instance = new LayersTreeProvider({ initialState: new Map() });
  instance.resetState = jest.fn();
  instance.initLayersState();
  expect(instance.resetState).toHaveBeenCalled();

  const callback = instance.resetState.mock.calls[0][0];
  expect(callback({})).toEqual({});
  expect(initLayersStateAction).not.toHaveBeenCalled();

  instance.props.layersTree = [];
  const layersTreeState = new Map([{}, {}]);
  expect(callback({ layersTreeState })).toEqual({
    layersTreeState,
  });
  expect(initLayersStateAction).not.toHaveBeenCalled();

  expect(callback({ layersTreeState: new Map() })).toEqual({
    layersTreeState: undefined,
  });
  expect(initLayersStateAction).toHaveBeenCalled();
});
