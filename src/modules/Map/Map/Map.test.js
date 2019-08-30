import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';

import { MapComponent as Map, getLayerBeforeId } from './Map';
import { updateCluster } from '../services/cluster';

const props = {
  map: mapboxgl.Map(),
  styles: {},
  accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
};

jest.mock('mapbox-gl', () => {
  const off = jest.fn();
  const map = {
    addControl: jest.fn(() => {}),
    getLayer: jest.fn(() => {}),
    addLayer: jest.fn(() => {}),
    getSource: jest.fn(() => {}),
    addSource: jest.fn(() => {}),
    removeControl: jest.fn(() => {}),
    removeLayer: jest.fn(() => {}),
    removeSource: jest.fn(() => {}),
    flyTo: jest.fn(() => {}),
    setMaxBounds: jest.fn(() => [
      [-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327], // France coordinates
    ]),
    setMaxZoom: jest.fn(() => 20),
    setMinZoom: jest.fn(() => 5),
    setStyle: jest.fn(() => 'mapbox://styles/mapbox/light-v9'),
    setLayoutProperty: jest.fn(),
    setPaintProperty: jest.fn(),
    setFilter: jest.fn(),
    on: jest.fn((event, layer, fn) => {
      fn({});
      return off;
    }),
    getCanvas: jest.fn(() => ({
      style: {},
    })),
    once: jest.fn((event, fn) => {
      fn(map);
      return off;
    }),
    fire: jest.fn(),
    getStyle: jest.fn(() => ({ layers: [{ id: 'foo' }, { id: 'bar' }] })),
    touchZoomRotate: {
      enableRotation: jest.fn(),
      disableRotation: jest.fn(),
    },
  };

  const PopupFunctions = {};
  const Popup = jest.fn(() => PopupFunctions);
  PopupFunctions.setLngLat = jest.fn(() => PopupFunctions);
  PopupFunctions.setHTML = jest.fn(() => PopupFunctions);
  PopupFunctions.addTo = jest.fn(() => PopupFunctions);
  PopupFunctions.setDOMContent = jest.fn(() => PopupFunctions);
  Popup.functions = PopupFunctions;

  const mockedControl = {
    _container: {
      querySelector: jest.fn(() => ({
        setAttribute: jest.fn(),
      })),
      classList: {
        add: jest.fn(),
      },
    },
  };
  return {
    off,
    Map: jest.fn(() => map),
    ScaleControl: jest.fn(() => {}),
    MockedControl: mockedControl,
    NavigationControl: jest.fn(() => mockedControl),
    AttributionControl: jest.fn(() => {}),
    Popup,
  };
});

jest.mock('lodash.debounce', () => jest.fn(fn => (...args) => fn(...args)));

jest.mock('../services/cluster', () => ({
  updateCluster: jest.fn(),
}));
afterEach(() => {
  jest.clearAllMocks();
});

it('should render correctly', () => {
  const tree = renderer.create(<Map {...props} />).toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Mount and update methods', () => {
  it('should call initMapProperties in mount', () => {
    jest.spyOn(Map.prototype, 'initMapProperties');
    const wrapper = shallow(<Map {...props} />);
    expect(wrapper.instance().initMapProperties).toHaveBeenCalled();
  });

  it('should call updateMapProperties in update', () => {
    const wrapper = shallow(<Map {...props} />);
    jest.spyOn(wrapper.instance(), 'updateMapProperties');
    wrapper.setProps({ maxZoom: 7 });
    expect(wrapper.instance().updateMapProperties).toHaveBeenCalled();
  });

  it('should call updateFlyTo in updateMapProperties', () => {
    const wrapper = shallow(<Map {...props} />);
    jest.spyOn(wrapper.instance(), 'updateFlyTo');
    wrapper.setProps({ maxZoom: 7 });
    expect(wrapper.instance().updateFlyTo).toHaveBeenCalled();
  });
});

describe('on properties changes', () => {
  it('should call flyTo and set new flyTo on update', () => {
    const wrapper = shallow(<Map {...props} />);
    const flyTo = {
      center: [10, 9],
      zoom: 7,
      speed: true,
      curve: false,
      easing: () => {},
    };

    wrapper.setProps({ flyTo });
    expect(props.map.flyTo).toHaveBeenCalledWith(flyTo);
  });

  it('should call flyTo and not update flyTo property', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 9 });
    expect(props.map.flyTo).not.toHaveBeenCalled();
  });

  it('should call setMaxBound on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: [[0, 0], [0, 0]] });
    expect(props.map.setMaxBounds).toHaveBeenCalled();
  });

  it("should not call setMaxBound if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: false });
    expect(props.map.setMaxBounds).not.toHaveBeenCalled();
  });

  it('should call setMaxZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 7 });
    expect(props.map.setMaxZoom).toHaveBeenCalled();
  });

  it("should not call setMaxZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 20 });
    expect(props.map.setMaxZoom).not.toHaveBeenCalled();
  });

  it('should call setMinZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 7 });
    expect(props.map.setMinZoom).toHaveBeenCalled();
  });

  it("should not call setMinZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 0 });
    expect(props.map.setMinZoom).not.toHaveBeenCalled();
  });

  it('should call setStyle on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'createLayers');
    wrapper.setProps({ backgroundStyle: 'foo' });
    expect(props.map.setStyle).toHaveBeenCalledWith('foo', { diff: false });
    expect(instance.createLayers).toHaveBeenCalled();
  });

  it("should not call setStyle if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ styles: 'mapbox://styles/mapbox/light-v9' });
    expect(props.map.setStyle).not.toHaveBeenCalled();
  });

  it('should call replaceLayers on property change', () => {
    const customStyle = {
      sources: [{
        id: 'foo',
        type: 'vector',
        url: 'somewhere',
      }],
      layers: [{
        id: 'layer1',
        type: 'fill',
      }, {
        id: 'layer2',
        type: 'circle',
      }],
    };
    const customStyleChanged = {
      sources: [{
        id: 'foo1',
        type: 'vector',
        url: 'somewhere',
      }],
      layers: [{
        id: 'layer3',
        type: 'fill',
      }, {
        id: 'layer2',
        type: 'circle',
      }],
    };

    const wrapper = shallow(<Map {...props} customStyle={customStyle} />);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'replaceLayers');
    wrapper.setProps({ customStyle: customStyleChanged });
    expect(instance.replaceLayers).toHaveBeenCalled();
  });

  it("should not call replaceLayers if property doesn't change", () => {
    const customStyle = {
      sources: [{
        id: 'foo',
        type: 'vector',
        url: 'somewhere',
      }],
      layers: [{
        id: 'layer1',
        type: 'fill',
      }],
    };
    const customStyle2 = {
      sources: [{
        id: 'foo',
        type: 'vector',
        url: 'somewhere',
      }],
      layers: [{
        id: 'layer1',
        type: 'fill',
      }],
    };
    const wrapper = shallow(<Map {...props} customStyle={customStyle} />);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'replaceLayers');
    wrapper.setProps({ customStyle: customStyle2 });
    expect(instance.replaceLayers).not.toHaveBeenCalled();
  });

  it('should remove layers and sources', () => {
    const map = {
      getStyle: () => ({ layers: [] }),
      getSource: jest.fn(() => true),
      getLayer: jest.fn(() => true),
      removeSource: jest.fn(),
      addSource: jest.fn(),
      removeLayer: jest.fn(),
    };
    const instance = new Map({ map });
    instance.deleteLayers({
      sources: [{
        id: 'source1',
        foo: 'foo',
      }, {
        id: 'source2',
        bar: 'bar',
      }],
      layers: [{
        id: 'layer1',
        foo: 'foo',
      }, {
        id: 'layer2',
        bar: 'bar',
      }],
    });
    expect(map.getSource).toHaveBeenCalledTimes(2);
    expect(map.getSource).toHaveBeenCalledWith('source1');
    expect(map.getSource).toHaveBeenCalledWith('source2');
    expect(map.getLayer).toHaveBeenCalledTimes(2);
    expect(map.getLayer).toHaveBeenCalledWith({
      id: 'layer1',
      foo: 'foo',
    });
    expect(map.getLayer).toHaveBeenCalledWith({
      id: 'layer2',
      bar: 'bar',
    });
    expect(map.removeSource).toHaveBeenCalledWith('source1', { foo: 'foo' });
    expect(map.removeSource).toHaveBeenCalledWith('source2', { bar: 'bar' });
    expect(map.removeLayer).toHaveBeenCalledWith({
      id: 'layer1',
      foo: 'foo',
    }, undefined);
    expect(map.removeLayer).toHaveBeenCalledWith({
      id: 'layer2',
      bar: 'bar',
    }, undefined);
  });
});

it('should toggle rotate', () => {
  const instance = new Map({ ...props }, {});
  instance.props.rotate = true;
  instance.toggleRotate();
  expect(props.map.touchZoomRotate.enableRotation).toHaveBeenCalled();
  instance.props.rotate = false;
  instance.toggleRotate();
  expect(props.map.touchZoomRotate.disableRotation).toHaveBeenCalled();
});

it('should update rotate', () => {
  Map.prototype.toggleRotate = jest.fn();
  const wrapper = shallow(<Map {...props} />);
  Map.prototype.toggleRotate.mockClear();
  wrapper.setProps({ rotate: true });
  expect(Map.prototype.toggleRotate).toHaveBeenCalled();
});

it('should create layers', () => {
  const addedLayers = [];
  const map = {
    addSource: jest.fn(),
    addLayer: jest.fn(layer => addedLayers.push(layer)),
    getStyle: jest.fn(() => ({
      layers: [],
    })),
  };
  const customStyle = {
    sources: [{
      id: 'foo',
      type: 'vector',
      url: 'somewhere',
    }],
    layers: [{
      id: 'layer1',
      type: 'circle',
    }, {
      id: 'layer2',
      type: 'fill',
    }, {
      id: 'layer3',
      type: 'raster',
    }, {
      id: 'layer4',
      type: 'circle',
    }, {
      id: 'layer5',
      type: 'symbol',
    }],
  };
  const instance = new Map({ map, customStyle }, {});
  instance.createLayers();
  expect(map.addSource).toHaveBeenCalledTimes(1);
  expect(map.addLayer).toHaveBeenCalledTimes(5);
  expect(map.addSource).toHaveBeenCalledWith('foo', {
    type: 'vector',
    url: 'somewhere',
  });
  expect(map.addLayer).toHaveBeenCalledWith({ id: 'layer1', type: 'circle' }, undefined);
  expect(map.addLayer).toHaveBeenCalledWith({ id: 'layer2', type: 'fill' }, undefined);
  expect(addedLayers).toEqual([{
    id: 'layer3',
    type: 'raster',
  }, {
    id: 'layer2',
    type: 'fill',
  }, {
    id: 'layer1',
    type: 'circle',
  }, {
    id: 'layer4',
    type: 'circle',
  }, {
    id: 'layer5',
    type: 'symbol',
  }]);
});

it('should get layer before', () => {
  expect(getLayerBeforeId('line', [{
    type: 'line',
    id: 'a',
  }, {
    type: 'line',
    id: 'b',
  }, {
    type: 'line',
    id: 'c',
  }, {
    type: 'circle',
    id: 'd',
  }])).toBe('d');

  expect(getLayerBeforeId('circle', [{
    type: 'line',
    id: 'a',
  }, {
    type: 'line',
    id: 'b',
  }, {
    type: 'line',
    id: 'c',
  }, {
    type: 'circle',
    id: 'd',
  }])).toBe(undefined);

  expect(getLayerBeforeId('fill', [{
    type: 'fill',
    id: 'a',
  }, {
    type: 'line',
    id: 'b',
  }, {
    type: 'line',
    id: 'c',
  }, {
    type: 'circle',
    id: 'd',
  }])).toBe('b');

  expect(getLayerBeforeId('fill', [])).toBe(undefined);
});

it('should create cluster layer', () => {
  const map = {
    getStyle: jest.fn(() => ({ layers: [] })),
  };
  const instance =  new Map({
    customStyle: {
      sources: [],
      layers: [{
        id: 'foo',
        cluster: {},
      }],
    },
    map,
  });
  instance.createClusterLayer = jest.fn();
  instance.createLayers();
  expect(instance.createClusterLayer).toHaveBeenCalledTimes(1);
});

it('should debounce cluster creation', () => {
  const listeners = [];
  const map = {
    on: jest.fn((type, listener) => listeners.push({ type, listener })),
    once: jest.fn((type, listener) => listeners.push({ type, listener })),
  };
  const instance = new Map({ map });
  const layer = {};
  instance.createClusterLayer(layer);
  expect(updateCluster).toHaveBeenCalledWith(map, layer, undefined);
  expect(updateCluster).toHaveBeenCalledTimes(1);

  expect(listeners.length).toBe(5);
  listeners[0].listener();
  expect(updateCluster).toHaveBeenCalledTimes(2);
  listeners[1].listener();
  expect(updateCluster).toHaveBeenCalledTimes(3);
  listeners[2].listener();
  expect(updateCluster).toHaveBeenCalledTimes(4);
  listeners[3].listener();
  expect(updateCluster).toHaveBeenCalledTimes(5);
});

it('should update on map events', () => {
  const listeners = [];
  const onMapUpdate = jest.fn();
  const map = {
    on: jest.fn((type, listener) => listeners.push({ type, listener })),
    once: jest.fn((type, listener) => listeners.push({ type, listener })),
    off: jest.fn(),
  };
  const instance = new Map({ onMapUpdate, map });
  instance.debouncedUpdateCluster = jest.fn();
  instance.createClusterLayer({});

  const sourcedataListener = listeners.find(({ type }) => type === 'sourcedata');
  expect(sourcedataListener).toBeDefined();

  sourcedataListener.listener({});

  expect(onMapUpdate).not.toHaveBeenCalled();
  expect(map.off).not.toHaveBeenCalled();

  sourcedataListener.listener({ isSourceLoaded: true });

  expect(onMapUpdate).toHaveBeenCalled();
  expect(map.off).toHaveBeenCalled();
});

describe('controls', () => {
  const map = {
    removeControl: jest.fn(),
    addControl: jest.fn(),
    setCenter: jest.fn(),
    fitBounds: jest.fn(),
    fire: jest.fn((event, item) => item),
  };

  beforeEach(() => {
    map.removeControl.mockClear();
    map.addControl.mockClear();
    map.setCenter.mockClear();
  });

  it('should update controls', () => {
    const instance = new Map({});
    instance.resetControls = jest.fn();
    instance.props.controls = [{}];
    instance.updateMapProperties({ controls: [] });
    expect(instance.resetControls).toHaveBeenCalled();
  });

  it('should reset controls', () => {
    const translate = jest.fn(() => 'foo');
    const instance = new Map({ map, translate });
    class CustomControl {
      // eslint-disable-next-line class-methods-use-this
      onAdd () {}

      // eslint-disable-next-line class-methods-use-this
      onRemove () {}
    }

    instance.props.controls = [{
      control: 'NavigationControl',
      position: 'top-right',
    }, {
      control: 'AttributionControl',
      position: 'bottom-right',
    }, {
      control: 'ScaleControl',
      position: 'bottom-left',
    }, {
      control: CustomControl,
      position: 'top-left',
    }];
    instance.resetControls();

    expect(map.addControl).toHaveBeenCalledTimes(4);
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[1], 'bottom-right');
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[2], 'bottom-left');
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[3], 'top-left');
    expect(map.fire).toHaveBeenCalledTimes(4);
    expect(map.fire).toHaveBeenCalledWith('control_added', { control: instance.props.controls[0].control });
    expect(map.fire).toHaveBeenCalledWith('control_added', { control: instance.props.controls[1].control });
    expect(map.fire).toHaveBeenCalledWith('control_added', { control: instance.props.controls[2].control });
    expect(map.fire).toHaveBeenCalledWith('control_added', { control: instance.props.controls[3].control });
    expect(map.removeControl).not.toHaveBeenCalled();

    instance.resetControls();

    expect(map.removeControl).toHaveBeenCalledTimes(4);
    expect(map.removeControl).toHaveBeenCalledWith(instance.controls[0]);
    expect(map.removeControl).toHaveBeenCalledWith(instance.controls[1]);
    expect(map.removeControl).toHaveBeenCalledWith(instance.controls[2]);
    expect(map.removeControl).toHaveBeenCalledWith(instance.controls[3]);
  });

  it('should reset on unmount', () => {
    const instance = new Map({ map });
    instance.controls = [{}, {}];
    instance.componentWillUnmount();
    expect(map.removeControl).toHaveBeenCalledTimes(2);
  });


  it('should update search control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'SearchControl',
        position: 'top-right',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
  });

  it('should update capture control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'CaptureControl',
        position: 'top-right',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
  });

  it('should update draw control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'DrawControl',
        position: 'top-left',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-left');
  });

  it('should update print control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'PrintControl',
        position: 'top-right',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
  });

  it('should update home control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'HomeControl',
        position: 'top-right',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
  });

  it('should update Share control state', () => {
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'ShareControl',
        position: 'top-right',
      }],
    };
    instance.resetControls();
    expect(map.addControl).toHaveBeenCalledWith(instance.controls[0], 'top-right');
  });


  it('should focus on search result', () => {
    const instance = new Map({ map });

    instance.focusOnSearchResult({});
    expect(map.fitBounds).not.toHaveBeenCalled();
    expect(map.fitBounds).not.toHaveBeenCalled();

    instance.focusOnSearchResult({ center: [1, 2] });
    expect(map.setCenter).toHaveBeenCalledWith([1, 2]);

    instance.focusOnSearchResult({ bounds: [1, 2] });
    expect(map.fitBounds).toHaveBeenCalledWith([1, 2], {
      padding: 10,
    });
  });

  it('should click on search result', () => {
    const instance = new Map({ map });
    instance.focusOnSearchResult = jest.fn();
    const result = {};
    instance.onSearchResultClick()({ result });
    expect(instance.focusOnSearchResult).toHaveBeenCalledWith(result);
    instance.focusOnSearchResult.mockClear();

    const onSearchResultClick = jest.fn();
    instance.onSearchResultClick(onSearchResultClick)({ result });
    expect(onSearchResultClick).toHaveBeenCalledWith({
      result,
      map,
      focusOnSearchResult: instance.focusOnSearchResult,
    });
  });

  it('should disable a mapbox bundled control', () => {
    const translate = jest.fn(() => 'foo');
    const instance = new Map({});
    instance.props = {
      map,
      controls: [{
        control: 'NavigationControl',
        position: 'top-right',
        disabled: true,
      }],
      translate,
    };
    instance.resetControls();
    const { controls: [{ _container: { classList: { add } } }] } = instance;
    expect(add).toHaveBeenCalledWith('mapboxgl-ctrl--disabled');
  });

  it('should not crash when disabling an unknow and not standard control', () => {
    const instance = new Map({});

    class CustomControl {}

    instance.props = {
      map,
      controls: [{
        control: CustomControl,
        position: 'top-right',
        disabled: true,
      }],
    };
    expect(() => instance.resetControls()).not.toThrow();
  });
});
