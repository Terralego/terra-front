import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import mapboxGl from 'mapbox-gl';
import centroid from '@turf/centroid';

import { setInteractions } from './services/mapUtils';
import InteractiveMap, {
  INTERACTION_FIT_ZOOM,
  INTERACTION_ZOOM,
  INTERACTION_FLY_TO,
  INTERACTION_DISPLAY_TOOLTIP,
  INTERACTION_FN,
  INTERACTION_HIGHLIGHT,
  getHighlightLayerId,
} from './InteractiveMap';

jest.mock('@turf/bbox', () => jest.fn());
jest.mock('mapbox-gl', () => {
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
jest.mock('../Map', () => function MapComponent () { return null; });
jest.mock('./services/mapUtils', () => ({
  toggleLayerVisibility: jest.fn(),
  setLayerOpacity: jest.fn(),
  setInteractions: jest.fn(),
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
jest.mock('./components/BackgroundStyles', () => () => <p>BackgroundStyles</p>);
jest.mock('../services/cluster', () => ({
  getClusteredFeatures: jest.fn(),
}));

beforeEach(() => {
  mapboxGl.Popup.prototype.remove.mockClear();
  ReactDOM.render.mockClear();
});

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
      }],
    });
    const tree = wrapper.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render background style selector', () => {
    const tree = renderer.create((
      <InteractiveMap
        backgroundStyle={[{ label: 'foo', url: 'mapbox://foo' }, { label: 'bar', url: 'mapbox://bar' }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('map', () => {
  it('should init map', () => {
    const onMapInit = jest.fn();
    let instance = new InteractiveMap({ onMapInit });
    const map = {};
    instance.onMapInit(map);
    expect(onMapInit).toHaveBeenCalledWith(map);
    onMapInit.mockClear();

    instance = new InteractiveMap({});
    instance.onMapInit(map);
    expect(onMapInit).not.toHaveBeenCalled();
  });

  it('should load map', () => {
    const instance = new InteractiveMap({});
    const map = { on: jest.fn() };
    instance.filterLegendsByZoom = jest.fn();
    instance.setInteractions = jest.fn();
    instance.onMapLoaded(map);
    expect(instance.map).toBe(map);
    expect(instance.setInteractions).toHaveBeenCalled();
    expect(instance.filterLegendsByZoom).toHaveBeenCalled();
  });

  it('should return filtered legends', () => {
    const instance = new InteractiveMap({
      legends: [
        { minZoom: 10, maxZoom: 15, title: 'pwet', items: [] },
        { minZoom: 0, maxZoom: 10, title: 'pwout', items: [] },
        { minZoom: 0, maxZoom: 0 },
        { minZoom: 0, maxZoom: 1 },
        { title: 'w' },
      ],
    });
    instance.setState = jest.fn();
    const map = {
      getZoom: jest.fn(() => 10),
      on: jest.fn(),
    };
    instance.setInteractions = jest.fn();
    instance.onMapLoaded(map);
    expect(instance.map).toBe(map);
    expect(map.getZoom).toHaveBeenCalled();
    expect(instance.setState).toHaveBeenCalledWith({
      legends: [{ minZoom: 0, maxZoom: 10, title: 'pwout', items: [] }, { title: 'w' }],
    });
    map.getZoom = jest.fn(() => 0);
    instance.onMapLoaded(map);
    expect(instance.setState).toHaveBeenCalledWith({
      legends: [{ minZoom: 0, maxZoom: 10, title: 'pwout', items: [] }, { title: 'w' }],
    });
    map.getZoom = jest.fn(() => 1);
    instance.onMapLoaded(map);
    expect(instance.setState).toHaveBeenCalledWith({
      legends: [
        { minZoom: 0, maxZoom: 10, title: 'pwout', items: [] },
        { minZoom: 0, maxZoom: 1 },
        { title: 'w' },
      ],
    });
  });

  it('should update legends correctly', () => {
    const instance = new InteractiveMap({});
    instance.filterLegendsByZoom = jest.fn();
    instance.componentDidUpdate({}, {});
    expect(instance.filterLegendsByZoom).not.toHaveBeenCalled();
    instance.componentDidUpdate({ legends: [] }, {});
    expect(instance.filterLegendsByZoom).toHaveBeenCalled();
  });

  it('should not filterLegendsByZoom without map', () => {
    const instance = new InteractiveMap({});
    instance.filterLegendsByZoom();
    instance.setState = jest.fn();
    expect(instance.setState).not.toHaveBeenCalled();
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
    const interactions = [];
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

  describe('fitZoom interaction', () => {
    it('should trigger fitZoom interaction', () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });
      const map = { fitBounds: jest.fn() };
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
        map,
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
    });

    it('should call bbox & fitBounds', () => {
      const interactions = [];
      const instance = new InteractiveMap({
        interactions,
      });
      const map = { fitBounds: jest.fn() };
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
      instance.fitZoom({ feature, map });
      expect(map.fitBounds).toHaveBeenCalled();
    });
  });

  it('should trigger highlight interaction', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.addHighlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: {},
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
      { feature: {}, highlightColor: 'red', unique: true },
    );
  });

  it('should trigger highlight interaction by click', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.addHighlight = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { layer: { id: 'pwet' }, properties: { _id: 1 } },
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
    instance.map.getLayer = jest.fn(() => 'fakeLayer');
    instance.map.addLayer = jest.fn();
    instance.map.getPaintProperty = jest.fn();
    instance.map.setFilter = jest.fn();
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
    instance.addHighlight({
      feature: { layer: { id: 'pwet' }, properties: { _id: 1 } },
      highlightColor: 'red',
      unique: true,
    });
    expect(instance.highlightedLayers.has('pwet')).toBe(true);

    instance.addHighlight({
      highlightColor: 'red',
    });
    expect(instance.highlightedLayers.size).toEqual(1);

    instance.addHighlight({
      feature: { layer: { id: 'pwat' }, properties: { _id: 1 } },
      highlightColor: 'red',
    });
    expect(instance.highlightedLayers.size).toEqual(2);
  });

  it('should highlight selected features', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'red');
    instance.map.getLayer = jest.fn(() => true);
    instance.map.addLayer = jest.fn();
    instance.triggerInteraction({
      event: {},
      feature: { layer: { id: 'pwet' }, properties: { _id: 1 } },
      interaction: {
        id: 'foo',
        interaction: INTERACTION_HIGHLIGHT,
        trigger: 'mouseover',
      },
      eventType: 'mousemove',
    });
    await true;
    instance.addHighlight({ feature: { layer: { id: 'new' }, properties: { _id: 1 } } });
    expect(instance.map.setFilter).toHaveBeenCalled();
    expect(instance.map.getPaintProperty).toHaveBeenCalled();
  });

  it('should remove highlight', async () => {
    const interactions = [];
    const instance = new InteractiveMap({ interactions });
    instance.map = {};
    instance.map.getLayer = jest.fn(() => true);
    instance.map.removeLayer = jest.fn();
    instance.map.getPaintProperty = jest.fn(() => 'red');
    instance.highlight = jest.fn();
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
    const feature = { layer: { id: 'test' }, properties: { _id: 3 } };
    instance.addHighlight({
      feature,
      highlightColor: 'red',
    });
    instance.removeHighlight({ feature });
    expect(instance.highlightedLayers.has('test')).toEqual(true);

    const newFeat = { layer: { id: 'test' }, properties: { _id: 3 } };
    instance.addHighlight({
      feature,
      highlightColor: 'red',
    });
    instance.addHighlight({
      feature: { ...newFeat, properties: { _id: 15 } },
    });
    instance.removeHighlight({ feature: { layer: { id: 'test' }, properties: { _id: 3 } } });
    expect(instance.highlightedLayers.has('test')).toEqual(true);
    expect(instance.highlightedLayers.get('test')).toEqual({ highlightColor: undefined, ids: [15] });
    expect(instance.highlight).toHaveBeenCalledWith();
  });

  it('should remove nothing', () => {
    const instance = new InteractiveMap({});
    instance.map = {};
    instance.highlightedLayers.set('test1', { ids: [1, 2] });
    instance.map.addLayer = jest.fn();
    instance.map.setFilter = jest.fn();
    instance.map.getPaintProperty = jest.fn();
    instance.map.getLayer = jest.fn(() => true);
    instance.map.removeLayer = jest.fn();
    instance.removeHighlight({
      feature: {
        layer: { id: 'test1' },
        properties: { _id: 3 },
      },
    });
    instance.removeHighlight({
      feature: {
        layer: { id: 'test1' },
        properties: { _id: 4 },
      },
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
    instance.map.getLayer = jest.fn(() => false);
    instance.map.removeLayer = jest.fn();
    instance.highlightedLayers = new Map();
    instance.highlightedLayers.set('test1', {
      ids: [1],
      highlightColor: 'red',
    });
    instance.removeHighlight({
      feature: {
        layer: { id: 'test1' },
        properties: { _id: 1 },
      },
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
