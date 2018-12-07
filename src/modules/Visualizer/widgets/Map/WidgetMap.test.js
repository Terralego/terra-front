import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import mapboxGl from 'mapbox-gl';

import { toggleLayerVisibility } from '../../services/mapUtils';
import WidgetMap, { INTERACTION_DISPLAY_DETAILS, INTERACTION_DISPLAY_TOOLTIP, INTERACTION_FN } from './WidgetMap';


jest.mock('mapbox-gl', () => {
  function Popup () {}
  Popup.prototype.setLngLat = jest.fn();
  Popup.prototype.setDOMContent = jest.fn();
  Popup.prototype.addTo = jest.fn();
  return {
    Popup,
  };
});
jest.mock('./components/Map', () => {
  // A class component is needed to accept the ref
  // eslint-disable-next-line global-require
  const { Component } = require('react');
  class MapComponent extends Component {
    state = {};
    render () {
      return null;
    }
  }
  return MapComponent;
});
jest.mock('../../services/mapUtils', () => ({
  toggleLayerVisibility: jest.fn(),
  addListenerOnLayer: jest.fn((map, id, callback) => [{ map, id, callback }]),
}));
jest.mock('react-dom', () => {
  const mockedElement = {};
  return {
    mockedElement,
    render: jest.fn((jsx, el) => el),
  };
});
jest.mock('lodash.debounce', () => fn => () => fn({ layerId: 'foo' }));

it('should render correctly', () => {
  const tree = renderer.create((
    <WidgetMap
      layersTree={[]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
it('should render correctly with a layers tree', () => {
  const tree = renderer.create((
    <WidgetMap
      layersTree={[{
        label: 'foo',
      }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should setInteraction on mount', () => {
  const instance = new WidgetMap();
  instance.setInteractions = jest.fn();
  instance.componentDidMount();
  expect(instance.setInteractions).toHaveBeenCalled();
});

it('should setInteraction on update', () => {
  const instance = new WidgetMap({});
  instance.setInteractions = jest.fn();
  instance.componentDidUpdate({});
  expect(instance.setInteractions).not.toHaveBeenCalled();
  instance.componentDidUpdate({ interactions: {} });
  expect(instance.setInteractions).toHaveBeenCalled();
});

it('should apply changes', async done => {
  const instance = new WidgetMap();
  const map = {};
  instance.map = map;
  instance.onChange({
    layer: {
      id: 'foo',
      layers: ['bar', 'babar'],
    },
    state: {
      active: true,
    },
  });
  await true;
  expect(toggleLayerVisibility).toHaveBeenCalledWith(map, 'bar', 'visible');
  expect(toggleLayerVisibility).toHaveBeenCalledWith(map, 'babar', 'visible');
  toggleLayerVisibility.mockClear();

  instance.onChange({
    layer: {
      id: 'foo',
      layers: ['bar'],
    },
    state: {
      active: false,
    },
  });
  await true;
  expect(toggleLayerVisibility).toHaveBeenCalledWith(map, 'bar', 'none');
  expect(toggleLayerVisibility).not.toHaveBeenCalledWith(map, 'babar', 'none');
  toggleLayerVisibility.mockClear();

  instance.onChange({
    layer: {
      id: 'bar',
    },
    state: {
      something: true,
    },
  });
  await true;

  expect(toggleLayerVisibility).not.toHaveBeenCalled();
  toggleLayerVisibility.mockClear();

  done();
});

it('should set interactions', async done => {
  const customFn = jest.fn();
  const instance = new WidgetMap({
    interactions: [{
      id: 'foo',
      interaction: INTERACTION_DISPLAY_DETAILS,
    }, {
      id: 'bar',
      interaction: INTERACTION_DISPLAY_TOOLTIP,
    }, {
      id: 'foo',
      interaction: INTERACTION_DISPLAY_TOOLTIP,
      trigger: 'mouseover',
    }, {
      id: 'foo',
      interaction: INTERACTION_FN,
      fn: customFn,
    }, {
      id: 'foo',
      interaction: 'invalid interaction',
    }],
  });
  instance.map = {};
  instance.displayDetails = jest.fn();
  instance.displayTooltip = jest.fn();
  instance.hideTooltip = jest.fn();

  instance.setInteractions();
  await true;

  const { mapInteractionsListeners } = instance;
  expect(mapInteractionsListeners.length).toBe(5);
  mapInteractionsListeners[0].callback();
  expect(instance.displayDetails).toHaveBeenCalled();
  instance.displayTooltip.mockClear();
  mapInteractionsListeners[1].callback();
  expect(instance.displayTooltip).toHaveBeenCalled();
  instance.displayTooltip.mockClear();
  mapInteractionsListeners[2].callback();
  expect(instance.displayTooltip).toHaveBeenCalled();
  instance.displayTooltip.mockClear();
  mapInteractionsListeners[3].callback();
  expect(instance.hideTooltip).toHaveBeenCalled();
  instance.displayTooltip.mockClear();
  mapInteractionsListeners[4].callback();
  expect(customFn).toHaveBeenCalled();
  done();
});

it('should stop interactions', async done => {
  const instance = new WidgetMap({
    interactions: [],
  });
  const mapInteractionsListeners = [jest.fn(), jest.fn(), jest.fn()];
  instance.mapInteractionsListeners = mapInteractionsListeners;
  instance.map = {};
  instance.setInteractions();
  await true;
  expect(mapInteractionsListeners[0]).toHaveBeenCalled();
  expect(mapInteractionsListeners[1]).toHaveBeenCalled();
  expect(mapInteractionsListeners[2]).toHaveBeenCalled();
  expect(instance.mapInteractionsListeners).toEqual([]);
  done();
});

it('should wait for map loading', async done => {
  const instance = new WidgetMap();
  const { map } = instance;
  let resolved = false;
  const mapObject = {};
  map.then(awaitedMapObject => {
    resolved = awaitedMapObject;
  });
  expect(map instanceof Promise).toBe(true);
  await new Promise(resolve => setTimeout(resolve, 11));
  expect(resolved).toBe(false);
  instance.mapRef = {
    current: {
      map: mapObject,
    },
  };
  await new Promise(resolve => setTimeout(resolve, 11));
  expect(resolved).toBe(mapObject);
  done();
});

it('should display details', () => {
  const setDetails = jest.fn();
  const instance = new WidgetMap({ setDetails });
  const params = { features: {}, template: {} };
  instance.displayDetails(params);
  expect(setDetails).toHaveBeenCalledWith({ features: params.features, template: params.template });
});

it('should display tooltips', async done => {
  const instance = new WidgetMap();
  instance.map = {};
  instance.displayTooltip({
    layerId: 'foo',
    event: {
      lngLat: { lng: 1, lat: 2 },
    },
    template: 'bar',
  });
  await true;
  expect(ReactDOM.render).toHaveBeenCalled();
  expect(mapboxGl.Popup.prototype.setLngLat).toHaveBeenCalledWith([1, 2]);
  expect(mapboxGl.Popup.prototype.setDOMContent).toHaveBeenCalled();
  expect(mapboxGl.Popup.prototype.addTo).toHaveBeenCalledWith(instance.map);
  mapboxGl.Popup.prototype.setLngLat.mockClear();
  mapboxGl.Popup.prototype.setDOMContent.mockClear();
  mapboxGl.Popup.prototype.addTo.mockClear();

  instance.displayTooltip({
    layerId: 'foo',
    features: [{
      properties: {},
    }],
    event: {
      lngLat: { lng: 3, lat: 4 },
    },
    template: 'bar',
  });
  await true;
  expect(mapboxGl.Popup.prototype.setLngLat).toHaveBeenCalledWith([3, 4]);
  expect(mapboxGl.Popup.prototype.setDOMContent).not.toHaveBeenCalled();
  expect(mapboxGl.Popup.prototype.addTo).not.toHaveBeenCalled();

  done();
});

it('should hide tooltip', () => {
  const instance = new WidgetMap();
  const popup = {
    remove: jest.fn(),
  };
  instance.popups.set('foo', popup);
  instance.hideTooltip({ layerId: 'foo' });
  expect(popup.remove).toHaveBeenCalled();
  popup.remove.mockClear();
  instance.hideTooltip({ layerId: 'foo' });
  expect(popup.remove).not.toHaveBeenCalled();
});
