/* eslint-disable max-classes-per-file */

import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import mapboxGl from 'maplibre-gl';
import centroid from '@turf/centroid';

import { setInteractions, fitZoom } from '../services/mapUtils';
import {
  InteractiveMap,
  INTERACTION_FIT_ZOOM,
  INTERACTION_ZOOM,
  INTERACTION_FLY_TO,
  INTERACTION_DISPLAY_TOOLTIP,
  INTERACTION_FN,
  INTERACTION_HIGHLIGHT,
  getHighlightLayerId,
} from './InteractiveMap';
import BackgroundStyles from './components/BackgroundStyles';

jest.mock('@turf/bbox', () => jest.fn());
jest.mock('maplibre-gl', () => {
  const Popup = jest.fn(function Popup () {
    this.listeners = [];
    // eslint-disable-next-line no-underscore-dangle
    this._content = {
      removeEventListener: jest.fn(),
      addEventListener: (event, callback) => this.listeners.push({ event, callback }),
    };
  });
  Popup.prototype.mockedListeners = [];
  Popup.prototype.once = jest.fn((event, listener) => {
    Popup.prototype.mockedListeners.push({ event, listener });
  });
  Popup.prototype.setLngLat = jest.fn();
  Popup.prototype.setDOMContent = jest.fn();
  Popup.prototype.addTo = jest.fn();
  Popup.prototype.remove = jest.fn();
  return {
    Popup,
  };
});
jest.mock('../Map', () => {
  function MapComponent () { return null; }
  MapComponent.CONTROLS_TOP_RIGHT = 'top-right';
  MapComponent.DEFAULT_CONTROLS = [];
  return MapComponent;
});
jest.mock('../services/mapUtils', () => ({
  toggleLayerVisibility: jest.fn(),
  setLayerOpacity: jest.fn(),
  setInteractions: jest.fn(),
  fitZoom: jest.fn(),
  checkContraints: () => true,
}));
jest.mock('react-dom', () => {
  const mockedElement = {};
  return {
    mockedElement,
    render: jest.fn((jsx, el) => el),
  };
});
jest.mock('lodash.debounce', () => fn => () => fn({ layerId: 'foo' }));

jest.mock('@turf/centroid', () => () => ({ geometry: { coordinates: [0, 0] } }));
// eslint-disable-next-line react/prefer-stateless-function
jest.mock('./components/BackgroundStyles', () => class BackgroundStylesMock {

});
jest.mock('../services/cluster', () => ({
  getClusteredFeatures: jest.fn(),
}));

beforeEach(() => {
  mapboxGl.Popup.prototype.remove.mockClear();
  ReactDOM.render.mockClear();
});

global.matchMedia = jest.fn().mockImplementation(query => ({
  matches: query === '(hover: hover)',
  media: '',
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

describe('snaphsots', () => {
  it('should render correctly', () => {
    const tree = renderer.create((
      <InteractiveMap
        layersTree={[]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with details', () => {
    const node = renderer.create((
      <InteractiveMap
        layersTree={[]}
      />
    ));
    node.getInstance().setState({ details: {} });
    const tree = node.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with a map navigation', () => {
    const tree = renderer.create((
      <InteractiveMap />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with hidden map navigation', () => {
    const tree = renderer.create((
      <InteractiveMap />
    ));
    tree.getInstance().setState({ isLayersTreeVisible: false });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should render legends', () => {
    const wrapper = renderer.create((
      <InteractiveMap
        legends={[{
          title: 'foo',
          items: [],
        }, {
          title: 'pwet',
          minZoom: 0,
          maxZoom: 20,
          items: [],
        }]}
      />
    ));
    wrapper.getInstance().setState({
      legends: [{
        title: 'foo',
        items: [],
      }, {
        title: 'pwet',
        minZoom: 0,
        maxZoom: 20,
        items: [],
      }, {
        title: 'foo',
        items: [],
      }],
    });
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('map', () => {
  it('should init map', () => {
    const onMapInit = jest.fn();
    let instance = new InteractiveMap({ onMapInit });
    const map = {};
    instance.onMapInit(map);
    expect(onMapInit).toHaveBeenCalledWith(map, instance);
    onMapInit.mockClear();

    instance = new InteractiveMap({});
    instance.onMapInit(map);
    expect(onMapInit).not.toHaveBeenCalled();
  });

  it('should add a method to map in init', () => {
    const map = {};
    const instance = new InteractiveMap({});
    instance.onMapInit(map);
    expect(map.triggerInteraction).toEqual(expect.any(Function));

    instance.triggerInteraction = jest.fn();
    const interaction = {};
    const feature = {
      layer: {
        id: 'foo',
      },
    };
    map.triggerInteraction({ interaction, feature });
    expect(instance.triggerInteraction).toHaveBeenCalledWith({
      map,
      event: expect.any(Object),
      feature,
      layerId: 'foo',
      interaction,
      eventType: 'click',
    });
  });

  it('should load map', () => {
    const instance = new InteractiveMap({});
    const map = { on: jest.fn() };
    instance.setInteractions = jest.fn();
    instance.onMapLoaded(map);
    expect(instance.map).toBe(map);
    expect(instance.setInteractions).toHaveBeenCalled();
  });

  it('should add uuids to legends', () => {
    const instance = new InteractiveMap({
      legends: [
        { title: 'pwet', items: [] },
        { title: 'pwout', items: [] },
        { items: [] },
      ],
    });
    instance.setState = jest.fn();
    instance.addUuidToLegends();
    expect(instance.setState).toHaveBeenCalled();
    expect(instance.setState.mock.calls[0][0].legends[0]).toHaveProperty('renderUuid');
  });

  it('should update legends correctly', () => {
    const instance = new InteractiveMap({});
    instance.addUuidToLegends = jest.fn();
    instance.componentDidUpdate({}, {});
    expect(instance.addUuidToLegends).not.toHaveBeenCalled();
    instance.componentDidUpdate({ legends: [] }, {});
    expect(instance.addUuidToLegends).toHaveBeenCalled();
  });

  it('should select backgroundStyle', () => {
    const instance = new InteractiveMap({
      backgroundStyle: 'bar',
    });
    expect(instance.state.selectedBackgroundStyle).toBe('bar');
  });

  it('should select first backgroundStyle', () => {
    const instance = new InteractiveMap({
      backgroundStyle: [{ url: 'foo' }, { url: 'bar' }],
    });
    expect(instance.state.selectedBackgroundStyle).toBe('foo');
  });

  it('should change background style', () => {
    const instance = new InteractiveMap({});
    instance.setState = jest.fn();
    const selectedBackgroundStyle = 'foo';
    instance.onBackgroundChange(selectedBackgroundStyle);
    expect(instance.setState).toHaveBeenCalledWith({ selectedBackgroundStyle });
  });

  it('should change background style and update map control', () => {
    const instance = new InteractiveMap({});
    instance.setState = () => {};
    const selectedBackgroundStyle = 'foo';
    instance.backgroundStyleControl = {
      setProps: jest.fn(),
    };
    instance.onBackgroundChange(selectedBackgroundStyle);
    expect(instance.backgroundStyleControl.setProps).toHaveBeenCalledWith({
      selected: selectedBackgroundStyle,
    });
  });

  it('should update controls', () => {
    const instance = new InteractiveMap({});
    instance.insertBackgroundStyleControl = jest.fn();
    instance.componentDidUpdate({ backgroundStyle: [] });
    expect(instance.insertBackgroundStyleControl).toHaveBeenCalled();
  });

  it('should add background styles control', () => {
    const backgroundStyle = [{}, {}];
    const selectedBackgroundStyle = 1;
    const instance = new InteractiveMap({
      backgroundStyle,
      controls: [{
        control: 'BackgroundStylesControl',
        position: 'top-right',
      }],
    });
    instance.state = { selectedBackgroundStyle };
    instance.setState = jest.fn();
    instance.insertBackgroundStyleControl();
    expect(instance.setState).toHaveBeenCalledWith({
      controls: [{
        control: expect.any(BackgroundStyles),
        position: 'top-right',
      }],
    });

    instance.setState.mockClear();
    instance.props.controls = [{
      control: new BackgroundStyles({}),
      position: 'top-right',
    }];
    instance.insertBackgroundStyleControl();
    expect(instance.setState).toHaveBeenCalledWith({
      controls: instance.props.controls,
    });
  });

  it('should add background styles control to default', () => {
    const backgroundStyle = [{}, {}];
    const selectedBackgroundStyle = 1;
    const instance = new InteractiveMap({
      backgroundStyle,
    });
    instance.state = { selectedBackgroundStyle };
    instance.setState = jest.fn();
    instance.insertBackgroundStyleControl();
    expect(instance.setState).toHaveBeenCalledWith({
      controls: [{
        control: expect.any(BackgroundStyles),
        position: 'top-right',
      }],
    });
  });
});

describe('Interactions', () => {
  it('should setInteraction on update', () => {
    const instance = new InteractiveMap({});
    instance.setInteractions = jest.fn();
    instance.componentDidUpdate({}, {});
    expect(instance.setInteractions).not.toHaveBeenCalled();
    instance.componentDidUpdate({ interactions: {} }, {});
    expect(instance.setInteractions).toHaveBeenCalled();
  });

  it('should not setInteraction without map', () => {
    const instance = new InteractiveMap({});
    instance.setInteractions();
    expect(setInteractions).not.toHaveBeenCalled();
  });

  it('should set interactions', async done => {
    const interactions = [{ id: 'foo' }];
    const instance = new InteractiveMap({
      interactions,
    });
    instance.map = {};
    instance.triggerInteraction = () => null;

    instance.setInteractions();
    await true;

    expect(setInteractions).toHaveBeenCalled();
    const {
      map: configMap,
      interactions: configInteractions,
      callback: configCallback,
    } = setInteractions.mock.calls[0][0];
    expect(configMap).toBe(instance.map);
    expect(configInteractions).toBe(interactions);

    instance.triggerInteraction = jest.fn();
    const config = {};
    configCallback(config);
    expect(instance.triggerInteraction).toHaveBeenCalledWith(config);
    done();
  });

  it('should unset interactions', async () => {
    const interactions = [{ id: 'foo' }];
    const instance = new InteractiveMap({
      interactions,
    });
    instance.map = {
      off: jest.fn(),
    };
    instance.triggerInteraction = () => null;
    instance.setState = jest.fn();

    instance.setInteractions();
    await true;
    expect(setInteractions).toHaveBeenCalled();

    instance.state = { interactionList: [{ id: 'foo' }] };
    instance.setInteractions([{ id: 'bar' }]);
    expect(instance.map.off).toHaveBeenCalled();
    expect(setInteractions).toHaveBeenCalled();
  });

  describe('fitZoom interaction', () => {
    it('should trigger fitZoom interaction', async () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });
      const feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [
                -33.83789062499999,
                60.37042901631508,
              ],
              [
                -39.814453125,
                55.825973254619015,
              ],
            ],
          ],
        },
      };
      instance.triggerInteraction({
        event: {},
        feature,
        layerId: 'foo',
        interaction: {
          id: 'foo',
          interaction: INTERACTION_FIT_ZOOM,
          trigger: 'click',
        },
        eventType: 'click',
      });
      await true;
      expect(fitZoom).toHaveBeenCalled();
    });
  });

  it('should trigger highlight interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.addHighlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { properties: { _id: 42 } },
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
        highlightColor: 'red',
      },
      eventType: 'mousemove',
    });
    await true;
    expect(instance.addHighlight).toHaveBeenCalledWith(
      { featureId: 42, layerId: 'foo', highlightColor: 'red', unique: true },
    );
  });

  it('should trigger highlight interaction by click', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.addHighlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'click',
        unique: true,
      },
      eventType: 'click',
    });
    await true;
    expect(instance.addHighlight).toHaveBeenCalled();
  });

  it('should highlight features', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.removeHighlight = jest.fn();
    instance.map = {};
    instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
    instance.map.addLayer = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'blue');
    instance.map.setFilter = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mouseleave',
    });
    await true;
    instance.addHighlight({
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      highlightColor: 'red',
      unique: true,
      source: 'fakeSource',
    });
    expect(instance.highlightedLayers.has('pwet')).toBe(true);

    instance.addHighlight({
      highlightColor: 'red',
    });
    expect(instance.highlightedLayers.size).toEqual(1);

    instance.addHighlight({
      feature: { properties: { _id: 1 } },
      layerId: 'pouet',
      highlightColor: 'red',
      source: 'fakeSource',
    });
    expect(instance.highlightedLayers.size).toEqual(2);
  });

  it('should highlight selected features', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'red');
    instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
    instance.map.addLayer = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mousemove',
    });
    await true;

    instance.addHighlight({ layerId: 'new', featureId: 1, source: 'fakeSource' });
    expect(instance.map.setFilter).toHaveBeenCalled();
    expect(instance.map.getPaintProperty).toHaveBeenCalled();
  });

  it('should trigger interaction without feature', async () => {
    const interactions = [];
    const instance = new InteractiveMap({
      interactions,
    });
    instance.triggerInteraction({
      event: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_FIT_ZOOM,
        trigger: 'click',
      },
      eventType: 'click',
    });
    await true;
    expect(fitZoom).toHaveBeenCalled();
  });

  describe('should highlight all geometries type', () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    global.console.warn = jest.fn();
    instance.map = {};
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'red');
    instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
    instance.map.addLayer = jest.fn();
    const props = {
      event: {},
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mousemove',
    };

    it('should highlight line type', async () => {
      instance.map.getLayer = jest.fn(() => ({ type: 'line' }));
      instance.triggerInteraction(props);
      await true;

      instance.addHighlight({ layerId: 'layerWithLine', featureId: 1, source: 'fakeSource' });
      expect(instance.map.setFilter).toHaveBeenCalledWith('line-layerWithLine-highlight', ['in', '_id', 1]);
    });

    it('should highlight circle type', async () => {
      instance.map.getLayer = jest.fn(() => ({ type: 'circle' }));
      instance.triggerInteraction(props);
      await true;

      instance.addHighlight({ layerId: 'layerWithCircle', featureId: 1, source: 'fakeSource' });
      expect(instance.map.setFilter).toHaveBeenCalledWith('circle-layerWithCircle-highlight', ['in', '_id', 1]);
    });

    it('should highlight fill type', async () => {
      instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
      instance.triggerInteraction(props);
      await true;

      instance.addHighlight({ layerId: 'layerWithFill', featureId: 1, source: 'fakeSource' });
      expect(instance.map.setFilter).toHaveBeenCalledWith('fill-layerWithFill-highlight', ['in', '_id', 1]);
    });

    it('should highlight symbol type', async () => {
      instance.map.getLayer = jest.fn(() => ({ type: 'symbol' }));
      instance.triggerInteraction(props);
      await true;

      instance.addHighlight({ layerId: 'layerWithFill', featureId: 1, source: 'fakeSource' });
      // "symbol" type is not yet supported
      // eslint-disable-next-line no-console
      expect(console.warn).toBeCalled();
      expect(instance.map.setFilter).toHaveBeenCalledWith('symbol-layerWithFill-highlight', ['in', '_id', 1]);
    });
  });

  it('should remove highlight', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
    instance.map.removeLayer = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'red');
    instance.highlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { properties: { _id: 1 } },
      layerId: 'pwet',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mouseleave',
    });
    await true;

    const layerId = 'test';
    const featureId = 3;
    const source = 'fakeSource';

    instance.addHighlight({
      layerId,
      featureId,
      source,
      highlightColor: 'red',
    });
    instance.removeHighlight({ layerId, featureId });
    expect(instance.highlightedLayers.has('test')).toEqual(true);

    instance.addHighlight({
      layerId,
      featureId,
      source,
      highlightColor: 'red',
    });
    instance.addHighlight({
      layerId,
      source,
      featureId: 15,
    });
    instance.removeHighlight({ layerId, featureId: 3 });
    expect(instance.highlightedLayers.has('test')).toEqual(true);
    expect(instance.highlightedLayers.get('test')).toEqual({ layersState: { highlightColor: undefined, ids: [15] }, propertyId: '_id', source: 'fakeSource' });
    expect(instance.highlight).toHaveBeenCalledWith();
  });

  it('should remove nothing', () => {
    const instance = new InteractiveMap({});
    instance.map = {};
    instance.highlightedLayers.set('test1', { ids: [1, 2] });
    instance.map.addLayer = jest.fn();
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn();
    instance.map.getLayer = jest.fn(() => ({ type: 'fill' }));
    instance.map.removeLayer = jest.fn();
    instance.removeHighlight({
      layerId: 'test1',
      featureId: 3,
    });
    instance.removeHighlight({
      layerId: 'test1',
      featureId: 4,
    });
    instance.removeHighlight({});
    instance.removeHighlight({});
  });

  it('should not remove highlight layer', () => {
    const instance = new InteractiveMap({});
    instance.map = {};
    instance.map.addLayer = jest.fn();
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn();
    instance.map.getLayer = jest.fn(() => true);
    instance.map.removeLayer = jest.fn();
    instance.highlightedLayers = new Map();
    instance.highlightedLayers.set('test1', {
      layersState: {
        ids: [1],
        highlightColor: 'red',
      },
    });
    instance.removeHighlight({
      layerId: 'test1',
      featureId: 1,
    });
    expect(instance.map.setFilter).toHaveBeenCalled();
  });

  it('should not crash if map has nothing', () => {
    const instance = new InteractiveMap({});
    instance.map = {};
    instance.map.getLayer = jest.fn(() => false);
    instance.map.removeLayer = jest.fn();
    instance.removeHighlight({ feature: { properties: { _id: 2 }, layer: { id: 1 } } });
  });

  it('should call removeHighlight if new & prev features are differents', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.removeHighlight = jest.fn();
    instance.addHighlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { layer: { id: 'pwet' }, properties: { _id: 1 } },
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mouseleave',
    });
    await true;
    instance.triggerInteraction({
      event: {},
      feature: { layer: { id: 'pwout' }, properties: { _id: 2 } },
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mouseleave',
    });
    await true;
    instance.triggerInteraction({
      event: {},
      feature: { layer: { id: 'pwet' }, properties: { _id: 2 } },
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'click',
        unique: true,
      },
      eventType: 'click',
    });
    await true;
  });

  it('should get highlightLayerId', () => {
    const a = getHighlightLayerId('a', 'line');
    const b = getHighlightLayerId('b');
    expect(a).toEqual('line-a-highlight');
    expect(b).toEqual('fill-b-highlight');
  });

  it('should not trigger interaction', () => {
    const interactions = [];
    const instance = new InteractiveMap({
      interactions,
    });
    const map = {};
    instance.displayTooltip = jest.fn();
    instance.triggerInteraction({
      map,
      event: {},
      feature: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_DISPLAY_TOOLTIP,
        template: 'template',
      },
      eventType: 'mousedown',
    });
    expect(instance.displayTooltip).not.toHaveBeenCalled();
  });

  it('should trigger displayTooltip interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({
      interactions,
    });
    const map = {};
    instance.displayTooltip = jest.fn();
    instance.triggerInteraction({
      map,
      event: {},
      feature: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_DISPLAY_TOOLTIP,
        template: 'template',
        trigger: 'click',
      },
      eventType: 'click',
    });
    await true;
    expect(instance.displayTooltip).toHaveBeenCalled();
  });

  it('should hide tooltip on mouseover out of the map', () => {
    const instance = new InteractiveMap({
      onInit () {},
    });
    instance.setState = () => null;
    instance.componentDidMount();
    const event = {
      target: {},
    };

    class Popup {
      remove = jest.fn();
    }
    const popup1 = new Popup();
    const popup2 = new Popup();
    const popup3 = new Popup();
    instance.popups.set('foo', { type: 'mousemove', popup: popup1 });
    instance.popups.set('bar', { type: 'click', popup: popup2 });
    instance.popups.set('baba', { type: 'mousemove', popup: popup3 });

    instance.mouseMoveListener(event);
    expect(instance.popups.size).toBe(3);

    instance.map = {
      getCanvasContainer: () => event.target,
    };

    instance.mouseMoveListener(event);
    expect(instance.popups.size).toBe(3);

    instance.map = {
      getCanvasContainer: () => {},
      getContainer: () => ({
        contains: () => true,
        querySelectorAll: () => [],
      }),
    };

    instance.mouseMoveListener(event);
    expect(instance.popups.size).toBe(3);

    instance.map = {
      getCanvasContainer: () => {},
      getContainer: () => ({
        contains: () => false,
        querySelectorAll: () => [],
      }),
    };

    instance.mouseMoveListener(event);
    expect(instance.popups.size).toBe(1);
    expect(popup1.remove).toHaveBeenCalled();
    expect(popup2.remove).not.toHaveBeenCalled();
    expect(popup3.remove).toHaveBeenCalled();
  });

  it('should cancel tooltip display when mouse isn\'t over map anymore', () => {
    const instance = new InteractiveMap({
      onInit () {},
    });
    instance.setState = () => null;
    instance.componentDidMount();

    const event = {
      target: {},
    };

    instance.map = {
      getZoom: jest.fn(() => 14),
      getCanvasContainer: () => {},
      getContainer: () => ({
        contains: () => true,
        querySelectorAll: () => [{
          contains: () => true,
        }],
      }),
    };

    instance.mouseMoveListener(event);
    instance.displayTooltip({
      layerId: 'foo',
      features: [{ properties: {} }],
      event: { lngLat: { lng: 3, lat: 4 } },
      template: 'bar',
    });

    expect(instance.popups.size).toBe(0);
  });

  it('should remove listener', () => {
    const instance = new InteractiveMap({});
    instance.mouseMoveListener = () => null;
    jest.spyOn(document.body, 'removeEventListener');
    instance.componentWillUnmount();
    expect(document.body.removeEventListener).toHaveBeenCalledWith('mousemove', instance.mouseMoveListener);
  });

  it('should trigger flyTo interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.flyTo = jest.fn();
    instance.map.fire = jest.fn();
    instance.map.getZoom = jest.fn(() => 10);
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -33.83789062499999,
              60.37042901631508,
            ],
            [
              -39.814453125,
              55.825973254619015,
            ],
          ],
        ],
      },
    };
    instance.triggerInteraction({
      event: {},
      feature,
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_ZOOM,
        trigger: 'click',
        step: 1,
      },
      eventType: 'click',
    });
    await true;
    expect(instance.map.flyTo).toHaveBeenCalledWith({
      center: centroid(feature).geometry.coordinates,
      zoom: 11,
    });
    instance.triggerInteraction({
      event: {},
      feature,
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_ZOOM,
        trigger: 'click',
      },
      eventType: 'click',
    });
    await true;
    expect(instance.map.flyTo).toHaveBeenCalledWith({
      center: centroid(feature).geometry.coordinates,
      zoom: 11,
    });
  });

  it('should trigger zoom interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.flyTo = jest.fn();
    instance.map.fire = jest.fn();
    instance.map.getMinZoom = jest.fn(() => 0);
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -33.83789062499999,
              60.37042901631508,
            ],
            [
              -39.814453125,
              55.825973254619015,
            ],
          ],
        ],
      },
    };
    instance.triggerInteraction({
      event: {},
      feature,
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_FLY_TO,
        trigger: 'click',
      },
      eventType: 'click',
    });
    await true;
    expect(instance.map.flyTo).toHaveBeenCalledWith({
      center: centroid(feature).geometry.coordinates,
      zoom: 12,
    });
    instance.triggerInteraction({
      event: {},
      feature,
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_FLY_TO,
        trigger: 'click',
        targetZoom: -1,
      },
      eventType: 'click',
    });
    await true;
    expect(instance.map.flyTo).toHaveBeenCalledWith({
      center: centroid(feature).geometry.coordinates,
      zoom: 1,
    });
  });

  it('should trigger interaction with constraints', async () => {
    const instance = new InteractiveMap({ interactions: [] });
    instance.displayTooltip = jest.fn();
    instance.triggerInteraction({
      map: {},
      event: {},
      feature: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_DISPLAY_TOOLTIP,
        template: 'template',
        trigger: 'click',
      },
      eventType: 'click',
    });
    await true;
    expect(instance.displayTooltip).toHaveBeenCalled();
  });

  describe('HideTooltip interaction', () => {
    it('should trigger when tooltip is not fixed', async () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });
      const map = {};
      instance.hideTooltip = jest.fn();
      instance.triggerInteraction({
        map,
        event: {
          lngLat: {},
        },
        feature: {},
        layerId: 'foo',
        interaction: {
          id: 'foo',
          interaction: INTERACTION_DISPLAY_TOOLTIP,
          template: 'template',
          trigger: 'mouseover',
        },
        eventType: 'mouseleave',
      });
      await true;
      expect(instance.hideTooltip).toHaveBeenCalled();
    });
    it('should trigger when tooltip is fixed and not hover the tooltip', async () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });

      const popup = new mapboxGl.Popup();
      // eslint-disable-next-line no-underscore-dangle
      popup._content = global.document.createElement('div');
      instance.popups.set('foo', { popup });

      const map = {};
      instance.hideTooltip = jest.fn();
      instance.triggerInteraction({
        map,
        event: {
          originalEvent: {
            explicitOriginalTarget: null,
            relatedTarget: global.document.createElement('div'),
          },
          lngLat: {},
        },
        feature: {
          geometry: {
            coordinates: [0, 0],
          },
        },
        layerId: 'foo',
        interaction: {
          id: 'foo',
          interaction: INTERACTION_DISPLAY_TOOLTIP,
          template: 'template',
          trigger: 'mouseover',
          fixed: true,
        },
        eventType: 'mouseleave',
      });
      await true;
      expect(instance.hideTooltip).toHaveBeenCalled();
    });

    it('should\'nt trigger when tooltip is fixed and hover the tooltip', () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });

      const popup = new mapboxGl.Popup();
      // eslint-disable-next-line no-underscore-dangle
      popup._content = global.document.createElement('div');
      instance.popups.set('foo', { popup });

      const map = {};
      instance.hideTooltip = jest.fn();
      instance.triggerInteraction({
        map,
        event: {
          originalEvent: {
            // eslint-disable-next-line no-underscore-dangle
            explicitOriginalTarget: popup._content,
            relatedTarget: null,
          },
          lngLat: {},
        },
        feature: {
          geometry: {
            coordinates: [0, 0],
          },
        },
        layerId: 'foo',
        interaction: {
          id: 'foo',
          interaction: INTERACTION_DISPLAY_TOOLTIP,
          template: 'template',
          trigger: 'mouseover',
          fixed: true,
        },
        eventType: 'mouseleave',
      });
      expect(instance.hideTooltip).not.toHaveBeenCalled();
    });
  });

  it('should trigger function interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({
      interactions,
      addHighlight: jest.fn(),
      removeHighlight: jest.fn(),
    });
    const map = {};
    const fn = jest.fn();
    instance.triggerInteraction({
      map,
      event: {},
      feature: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: INTERACTION_FN,
        fn,
      },
      eventType: 'click',
    });
    await true;
    expect(fn).toHaveBeenCalledWith({
      map,
      event: {},
      layerId: 'foo',
      feature: {},
      instance,
      clusteredFeatures: undefined,
    });
  });

  it('should trigger nothing', () => {
    const interactions = [];
    const instance = new InteractiveMap({
      interactions,
    });
    const map = {};
    instance.displayDetails = jest.fn();
    instance.displayTooltip = jest.fn();
    instance.triggerInteraction({
      map,
      event: {},
      feature: {},
      layerId: 'foo',
      interaction: {
        id: 'foo',
        interaction: 'random',
      },
      eventType: 'click',
    });
    expect(instance.displayDetails).not.toHaveBeenCalled();
    expect(instance.displayTooltip).not.toHaveBeenCalled();
  });

  it('should display tooltips', () => {
    const instance = new InteractiveMap({});
    instance.map = {
      getZoom: jest.fn(() => 14),
    };
    instance.displayTooltip({
      layerId: 'foo',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      template: 'bar',
    });

    expect(ReactDOM.render).toHaveBeenCalled();
    expect(mapboxGl.Popup.prototype.once).toHaveBeenCalled();
    expect(mapboxGl.Popup.prototype.setLngLat).toHaveBeenCalledWith([1, 2]);
    expect(mapboxGl.Popup.prototype.setDOMContent).toHaveBeenCalled();
    expect(mapboxGl.Popup.prototype.addTo).toHaveBeenCalledWith(instance.map);
    mapboxGl.Popup.prototype.setLngLat.mockClear();
    mapboxGl.Popup.prototype.setDOMContent.mockClear();
    mapboxGl.Popup.prototype.addTo.mockClear();
    mapboxGl.Popup.prototype.once.mockClear();

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

    expect(mapboxGl.Popup.prototype.once).not.toHaveBeenCalled();
    expect(mapboxGl.Popup.prototype.setLngLat).toHaveBeenCalledWith([3, 4]);
    expect(mapboxGl.Popup.prototype.setDOMContent).not.toHaveBeenCalled();
    expect(mapboxGl.Popup.prototype.addTo).not.toHaveBeenCalled();

    mapboxGl.Popup.prototype.mockedListeners[0].listener();

    expect(instance.popups.has('foo')).toBe(false);
  });

  it('should remove tooltip', () => {
    const instance = new InteractiveMap({});
    instance.map = {
      getZoom: jest.fn(() => 14),
    };
    instance.displayTooltip({
      layerId: 'foo',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      template: 'bar',
    });
    const { popup } = instance.popups.get('foo');
    popup.listeners[0].callback();
    expect(popup.remove).toHaveBeenCalled();
    // eslint-disable-next-line no-underscore-dangle
    expect(popup._content.removeEventListener).toHaveBeenCalled();
  });


  it('should display only one tooltips', async done => {
    const instance = new InteractiveMap({});
    instance.map = {
      getZoom: jest.fn(() => 14),
    };

    instance.displayTooltip({
      layerId: 'foo',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      template: 'bar',
    });
    await true;

    instance.displayTooltip({
      layerId: 'bar',
      event: {
        type: 'click',
        lngLat: { lng: 1, lat: 2 },
      },
      template: 'bar',
    });
    await true;

    expect(instance.popups.size).toBe(2);

    instance.displayTooltip({
      layerId: 'foobar',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      feature: {
        geometry: {
          coordinates: [0, 0],
        },
      },
      template: 'bar',
      unique: true,
      fixed: true,
    });

    await true;

    expect(instance.popups.size).toBe(1);
    expect(mapboxGl.Popup.prototype.remove).toHaveBeenCalledTimes(2);

    done();
  });

  it('should hide tooltip', () => {
    const instance = new InteractiveMap({});
    const obj = {
      popup: {
        remove: jest.fn(),
      },
    };
    const { popup } = obj;
    instance.popups.set('foo', obj);
    instance.hideTooltip({ layerId: 'foo' });
    expect(popup.remove).toHaveBeenCalled();
    popup.remove.mockClear();
    instance.hideTooltip({ layerId: 'foo' });
    expect(popup.remove).not.toHaveBeenCalled();
  });

  it('should build a new tooltip', () => {
    const instance = new InteractiveMap({});
    instance.map = {
      getZoom: jest.fn(() => 14),
    };
    instance.popups = {
      has: () => true,
      get: () => ({
        content: false,
      }),
      set () {},
    };

    instance.displayTooltip({
      layerId: 'foo',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      template: 'bar',
    });

    expect(mapboxGl.Popup).toHaveBeenCalled();
  });

  it('should display an element in a tooltip', async () => {
    const instance = new InteractiveMap({});
    instance.map = {
      getZoom: jest.fn(() => 14),
    };
    const element = document.createElement('div');

    instance.displayTooltip({
      layerId: 'foo',
      event: {
        lngLat: { lng: 1, lat: 2 },
      },
      element,
    });

    expect(ReactDOM.render).not.toHaveBeenCalled();
  });
});
