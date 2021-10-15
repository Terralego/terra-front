import React from 'react';
import renderer from 'react-test-renderer';
import { TYPE_RANGE } from '../../../Forms/Filters';

import { LayersTreeProvider } from './LayersTreeProvider';
import { connectLayersTree } from './context';
import * as layersTreeUtils from '../../services/layersTreeUtils';

const initLayersStateAction = jest.spyOn(layersTreeUtils, 'initLayersStateAction').mockImplementation(jest.fn());
const setLayerStateAction = jest.spyOn(layersTreeUtils, 'setLayerStateAction').mockImplementation(jest.fn());

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

  instance.props.initialLayersTreeState = {};
  instance.componentDidUpdate({});
  expect(instance.initLayersState).toHaveBeenCalledWith(instance.props.initialLayersTreeState);

  instance.props.layersTree = [];
  instance.componentDidUpdate({});
  expect(instance.initLayersState).toHaveBeenCalledWith();
});

it('should not update', () => {
  const instance = new LayersTreeProvider(new Map());
  instance.resetState = jest.fn();
  instance.initLayersState = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.resetState).not.toHaveBeenCalled();
  expect(instance.initLayersState).not.toHaveBeenCalled();

  instance.props.initialLayersTreeState = new Map([['a', 'b']]);
  instance.componentDidUpdate({ initialLayersTreeState: new Map([['a', 'b']]) });
  expect(instance.initLayersState).not.toHaveBeenCalled();
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

  const wait = instance.fetchPropertiesValues(layer, [property]);
  expect(property.loading).toEqual(true);
  expect(instance.resetState).toHaveBeenCalledWith({ layersTreeState: expect.any(Map) });
  instance.resetState.mockClear();
  expect(fetchPropertyValues).toHaveBeenCalledWith(layer, property, undefined);

  await wait;
  expect(property.values).toEqual(values);
  expect(instance.resetState).toHaveBeenCalledWith({ layersTreeState: expect.any(Map) });

  instance.props.fetchPropertyValues = jest.fn();
  await instance.fetchPropertiesValues(layer, [property], undefined);
  expect(property.values).toEqual([]);
});

it('should fetch property ranges', async () => {
  const fetchPropertyRange = jest.fn(() => ({ min: 2, max: 42 }));
  const instance = new LayersTreeProvider({ fetchPropertyRange });
  instance.resetState = jest.fn();
  const layersTreeState = new Map();
  const layer = {};
  const property = { type: TYPE_RANGE };
  layersTreeState.set(layer, {});
  instance.state.layersTreeState = layersTreeState;

  const wait = instance.fetchPropertiesValues(layer, [property]);
  expect(property.loading).toEqual(true);
  expect(instance.resetState).toHaveBeenCalledWith({ layersTreeState: expect.any(Map) });
  instance.resetState.mockClear();
  expect(fetchPropertyRange).toHaveBeenCalledWith(layer, property, undefined);

  await wait;
  expect(property.min).toBe(2);
  expect(property.max).toBe(42);
  expect(instance.resetState).toHaveBeenCalledWith({ layersTreeState: expect.any(Map) });

  instance.props.fetchPropertyRange = jest.fn();
  await instance.fetchPropertiesValues(layer, [property], undefined);
  expect(property.min).toBe(0);
  expect(property.max).toBe(100);
});

it('should init layers state', () => {
  const instance = new LayersTreeProvider({ initialState: new Map() });
  instance.props.getInitialState = jest.fn();
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

it('should get layers state from hash', () => {
  initLayersStateAction.mockRestore();

  const layer1 = { layers: ['thatlayerid'] };
  const layer2 = { layers: ['t'] };
  const layersTreeState = new Map();

  const initialState = {
    layers: ['thatlayerid', 'b'],
  };

  const instance = new LayersTreeProvider({
    initialState,
    layersTree: [layer1, layer2],
  });

  instance.resetState = jest.fn(stateFn => stateFn({ layersTreeState }));
  instance.initLayersState();
  expect(instance.resetState.mock.calls[0][0]({ layersTreeState: new Map() })).toEqual({
    layersTreeState: new Map([
      [layer1, {
        active: true,
        opacity: 1,
      }],
      [layer2, {
        active: false,
        opacity: 1,
      }],
    ]),
  });

  instance.props.initialState = {
    layers: 'thatlayerid',
  };
  instance.initLayersState();
  expect(instance.resetState.mock.calls[1][0]({ layersTreeState: new Map() })).toEqual({
    layersTreeState: new Map([
      [layer1, {
        active: true,
        opacity: 1,
      }],
      [layer2, {
        active: false,
        opacity: 1,
      }],
    ]),
  });

  instance.props.initialState = {
    layers: ['thatlayerid', 't'],
    table: 'thatlayerid',
  };
  instance.initLayersState();
  expect(instance.resetState.mock.calls[2][0]({ layersTreeState: new Map() })).toEqual({
    layersTreeState: new Map([
      [layer1, {
        active: true,
        opacity: 1,
        table: true,
      }],
      [layer2, {
        active: true,
        opacity: 1,
      }],
    ]),
  });
});

it('should set layers state from hash', () => {
  const setCurrentState = jest.fn();
  const layer1 = { layers: ['thatlayerid'] };
  const layer2 = { layers: ['t'] };
  const layer3 = {};
  const instance = new LayersTreeProvider({
    setCurrentState,
    onChange: jest.fn(),
  });

  instance.state = {
    layersTreeState: new Map([
      [layer1, {
        active: true,
        opacity: 1,
      }],
      [layer2, {
        active: false,
        opacity: 1,
      }],
      [layer3, {}],
    ]),
  };
  instance.setState = jest.fn(
    (stateFn, callback) => callback(stateFn(instance.state)),
  );
  instance.initLayersState();

  expect(setCurrentState).toHaveBeenCalledWith({
    layers: ['thatlayerid'],
    table: undefined,
  });

  instance.state = {
    layersTreeState: new Map([
      [layer1, {
        active: true,
        opacity: 1,
      }],
      [layer2, {
        active: true,
        opacity: 1,
        table: true,
      }],
    ]),
  };
  instance.initLayersState();
  expect(setCurrentState).toHaveBeenCalledWith({
    layers: ['thatlayerid', 't'],
    table: 't',
  });
});
