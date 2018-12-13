import React from 'react';
import renderer from 'react-test-renderer';
import ReactDOM from 'react-dom';
import mapboxGl from 'mapbox-gl';

import { toggleLayerVisibility, setLayerOpacity } from '../../services/mapUtils';
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
  setLayerOpacity: jest.fn(),
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
jest.mock('./components/BackgroundStyles', () => () => <p>BackgroundStyles</p>);
jest.mock('./components/MapNavigation', () => () => <p>MapNavigation</p>);

describe('snaphsots', () => {
  it('should render correctly', () => {
    const tree = renderer.create((
      <WidgetMap
        layersTree={[]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with a map navigation', () => {
    const tree = renderer.create((
      <WidgetMap
        layersTree={[{
          label: 'foo',
        }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render correctly with hidden map navigation', () => {
    const tree = renderer.create((
      <WidgetMap
        layersTree={[{
          label: 'foo',
        }]}
      />
    ));
    tree.getInstance().setState({ isLayersTreeVisible: false });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should display layerstree panel', () => {
    const instance = new WidgetMap({});
    instance.setState = jest.fn();
    const isLayersTreeVisible = false;
    instance.toggleLayersTree();
    expect(instance.setState).toHaveBeenCalledWith({ isLayersTreeVisible });
  });


  it('should render legends', () => {
    const tree = renderer.create((
      <WidgetMap
        layersTree={[{
          label: 'foo',
          initialState: {
            active: true,
          },
          legend: {
            label: 'foo',
            items: [],
          },
        }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render background style selector', () => {
    const tree = renderer.create((
      <WidgetMap
        backgroundStyle={[{ label: 'foo', url: 'mapbox://foo' }, { label: 'bar', url: 'mapbox://bar' }]}
      />
    )).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('map', () => {
  it('should wait for map loading', async done => {
    const instance = new WidgetMap({});
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

  it('should select backgroundStyle', () => {
    const instance = new WidgetMap({
      backgroundStyle: 'bar',
    });
    expect(instance.state.selectedBackgroundStyle).toBe('bar');
  });

  it('should select first backgroundStyle', () => {
    const instance = new WidgetMap({
      backgroundStyle: [{ url: 'foo' }, { url: 'bar' }],
    });
    expect(instance.state.selectedBackgroundStyle).toBe('foo');
  });

  it('should change background style', () => {
    const instance = new WidgetMap({});
    instance.setState = jest.fn();
    const selectedBackgroundStyle = 'foo';
    instance.onBackgroundChange(selectedBackgroundStyle);
    expect(instance.setState).toHaveBeenCalledWith({ selectedBackgroundStyle });
  });
});

describe('Interactions', () => {
  it('should setInteraction on update', () => {
    const instance = new WidgetMap({});
    instance.setInteractions = jest.fn();
    instance.componentDidUpdate({}, {});
    expect(instance.setInteractions).not.toHaveBeenCalled();
    instance.componentDidUpdate({ interactions: {} }, {});
    expect(instance.setInteractions).toHaveBeenCalled();
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

  it('should display details', () => {
    const setDetails = jest.fn();
    const instance = new WidgetMap({ setDetails });
    const params = { features: {}, template: {} };
    instance.displayDetails(params);
    expect(setDetails).toHaveBeenCalledWith({
      features: params.features, template: params.template,
    });
  });

  it('should display tooltips', async done => {
    const instance = new WidgetMap({});
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
    const instance = new WidgetMap({});
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

  it('should get legends', () => {
    const instance = new WidgetMap({}, {});
    instance.state.layersTreeState = new Map();
    const { layersTreeState } = instance.state;
    const legend1 = {
      items: [1],
    };
    const legend2 = {
      items: [2],
    };
    const legend3 = {
      items: [3],
    };
    const legend4 = {
      items: [4],
    };
    layersTreeState.set({
      label: 'foo',
    }, {
      active: true,
    });
    layersTreeState.set({
      label: 'bar',
      legend: legend1,
    }, {
      active: true,
    });
    layersTreeState.set({
      label: 'foofoo',
      legend: legend2,
    }, {
      active: false,
    });
    layersTreeState.set({
      label: 'barbar',
      sublayers: [{
        label: 'title barbar',
        legend: legend3,
      }, {}],
    }, {
      active: true,
      sublayers: [true, false],
    });
    layersTreeState.set({
      label: 'foobar',
      sublayers: [{
        legend: legend4,
      }, {}],
    }, {
      active: true,
      sublayers: [false, true],
    });
    const { legends } = instance;
    expect(legends.length).toBe(2);
    expect(legends[0]).toEqual({
      title: 'bar',
      items: [1],
    });
    expect(legends[1]).toEqual({
      title: 'title barbar',
      items: [3],
    });
  });
});

describe('LayersTree', () => {
  it('should be a Map', () => {
    const instance = new WidgetMap({});
    expect(instance.state.layersTreeState instanceof Map).toBe(true);
  });

  it('should init layers state', () => {
    const layersTree = [{
      label: 'label1',
      initialState: {
        active: true,
      },
      layers: ['layer1', 'layer2'],
    }, {
      group: 'group1',
      layers: [{
        label: 'label1.1',
        initialState: {
          active: true,
        },
        layers: ['layer1.1'],
      }, {
        label: 'label1.2',
        layers: ['layer1.2'],
      }],
    }, {
      label: 'layer2',
      initialState: {
        active: true,
      },
      sublayers: [{
        label: 'sublayer1',
        layers: ['sublayer1'],
      }, {
        label: 'sublayer2',
        layers: ['sublayer2'],
      }],
    }, {
      group: 'group2',
      layers: [{
        label: 'label2.1',
        sublayers: [{
          label: 'sublayer2.1',
          layers: ['sublayer2.1'],
        }, {
          label: 'sublayer2.2',
          layers: ['sublayer2.2'],
        }],
      }],
    }];
    const instance = new WidgetMap({ layersTree });
    instance.setState = jest.fn();
    instance.initLayersState();

    const expected = new Map();
    expected.set(layersTree[0], { active: true, opacity: 1 });
    expected.set(layersTree[1].layers[0], { active: true, opacity: 1 });
    expected.set(layersTree[1].layers[1], { active: false, opacity: 1 });
    expected.set(layersTree[2], { active: true, sublayers: [true, false], opacity: 1 });
    expected.set(layersTree[3].layers[0], { active: false, sublayers: [false, false], opacity: 1 });
    expect(instance.setState).toHaveBeenCalledWith({
      layersTreeState: expected,
    });
  });

  it('should update layersTreeState', () => {
    const layersTreeState = {};
    const instance = new WidgetMap({});

    instance.updateLayersTree = jest.fn();
    instance.state.layersTreeState = layersTreeState;

    instance.componentDidUpdate({ foo: 'bar ' }, { layersTreeState });
    expect(instance.updateLayersTree).not.toHaveBeenCalled();
    instance.updateLayersTree.mockClear();

    instance.componentDidUpdate({}, { layersTreeState: {} });
    expect(instance.updateLayersTree).toHaveBeenCalled();
  });

  it('should set layer state', () => {
    const layersTree = [{
      label: 'label',
    }];
    const instance = new WidgetMap({});
    instance.setState = jest.fn();
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set(layersTree[0], {
      active: false,
    });
    const state = { active: true };
    instance.setLayerState({ layer: layersTree[0], state });
    const expected = new Map();
    expected.set(layersTree[0], state);
    expect(instance.setState).toHaveBeenCalledWith({
      layersTreeState: expected,
    });
  });

  it('should not set layer state', () => {
    const layersTree = [{
      label: 'label',
    }];
    const instance = new WidgetMap({});
    instance.setState = jest.fn();
    instance.state.layersTreeState = new Map();
    const state = { active: true };
    instance.setLayerState({ layer: layersTree[0], state });
    const expected = new Map();
    expected.set(layersTree[0], state);
    expect(instance.setState).not.toHaveBeenCalled();
  });

  it('should get layer state', () => {
    const layersTree = [{
      label: 'label',
    }];
    const instance = new WidgetMap({});
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set(layersTree[0], {
      active: false,
    });
    expect(instance.getLayerState({ layer: layersTree[0] })).toEqual({
      active: false,
    });
    expect(instance.getLayerState({ layer: {} })).toEqual({});
  });

  it('should select sublayer', () => {
    const layersTree = [{
      label: 'label',
      sublayers: [{
        label: 'sublayer1',
      }, {
        label: 'sublayer2',
      }],
    }];
    const instance = new WidgetMap({});
    instance.setState = jest.fn();
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set(layersTree[0], {
      active: true,
      opacity: 1,
      sublayers: [true, false],
    });
    instance.selectSublayer({ layer: layersTree[0], sublayer: 1 });
    const expected = new Map();
    expected.set(layersTree[0], {
      active: true,
      opacity: 1,
      sublayers: [
        false,
        true,
      ],
    });
    expect(instance.setState).toHaveBeenCalledWith({
      layersTreeState: expected,
    });
  });

  it('should update map as layers tree state', async done => {
    const instance = new WidgetMap({});
    instance.map = {};

    // Many layers
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set({
      label: 'label1',
      layers: ['layer1'],
    }, {
      active: false,
    });
    instance.state.layersTreeState.set({
      label: 'label2',
      layers: ['layer2.1', 'layer2.2'],
    }, {
      active: true,
    });
    instance.updateLayersTree();
    await true;

    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer1',
      'none',
    );
    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer2.1',
      'visible',
    );
    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer2.2',
      'visible',
    );
    toggleLayerVisibility.mockClear();
    setLayerOpacity.mockClear();

    // opacity and visibility
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set({
      label: 'label1',
      layers: ['layer1'],
    }, {
      active: true,
      opacity: 0.3,
    });
    instance.updateLayersTree();
    await true;

    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer1',
      'visible',
    );
    expect(setLayerOpacity).toHaveBeenCalledWith(
      instance.map,
      'layer1',
      0.3,
    );
    toggleLayerVisibility.mockClear();
    setLayerOpacity.mockClear();

    // sublayers active
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set({
      label: 'label1',
      sublayers: [{
        label: 'label1.1',
        layers: ['layer1'],
      }, {
        label: 'label1.2',
        layers: ['layer2'],
      }],
    }, {
      active: true,
      sublayers: [true, false],
    });
    instance.updateLayersTree();
    await true;

    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer1',
      'visible',
    );
    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer2',
      'none',
    );

    // sublayers inactive
    instance.state.layersTreeState = new Map();
    instance.state.layersTreeState.set({
      label: 'label1',
      sublayers: [{
        label: 'label1.1',
        layers: ['layer1'],
      }, {
        label: 'label1.2',
        layers: ['layer2'],
      }],
    }, {
      active: false,
      sublayers: [true, false],
    });
    instance.updateLayersTree();
    await true;

    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer1',
      'none',
    );
    expect(toggleLayerVisibility).toHaveBeenCalledWith(
      instance.map,
      'layer2',
      'none',
    );

    done();
  });
});
