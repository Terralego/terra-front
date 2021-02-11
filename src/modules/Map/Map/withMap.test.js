import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';

import { withMap } from './withMap';


jest.mock('mapbox-gl', () => {
  const addedLayers = [];
  const map = {
    once: jest.fn((e, fn) => fn()),
    on: jest.fn((e, fn) => fn()),
    fitBounds: jest.fn(),
    getLayer: jest.fn(() => {}),
    addLayer: jest.fn((layer, beforeId) => {
      if (beforeId) {
        const index = addedLayers.findIndex(l => l.id === beforeId);
        addedLayers.splice(index, 0, layer);
      } else {
        addedLayers.push(layer);
      }
    }),
    clearLayers: () => {
      addedLayers.splice(0, addedLayers.length);
    },
    removeLayer: jest.fn(layer => {
      const index = addedLayers.findIndex(l => l.id === layer.id);
      addedLayers.splice(index, 1);
    }),
    getStyle: jest.fn(() => ({
      layers: addedLayers,
    })),
  };
  return {
    map,
    Map: jest.fn(() => map),
  };
});

const Component = jest.fn(() => null);
const ComponentWithMap = withMap(Component);

it('should render correctly', () => {
  const tree = renderer.create(<ComponentWithMap backgroundStyle="" />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have a map', () => {
  shallow(<ComponentWithMap backgroundStyle="" />);
  expect(mapboxgl.Map).toHaveBeenCalledWith({
    container: null,
    attributionControl: false,
    style: '',
    center: undefined,
    zoom: 9,
    maxZoom: undefined,
    minZoom: undefined,
    maxBounds: undefined,
    preserveDrawingBuffer: false,
    hash: undefined,
    locale: {},
  });
  expect(mapboxgl.map.once).toHaveBeenCalled();
  expect(Component).toHaveBeenCalled();
  const attrs = Component.mock.calls[0][0];
  expect(attrs.map).toBeDefined();
  expect(attrs.backgroundStyle).toEqual('');
  expect(attrs.fitBounds).toBe(null);
  expect(attrs.zoom).toEqual(9);
});

it('should have a map getter', () => {
  const wrapper = shallow(<ComponentWithMap backgroundStyle="" />);
  expect(wrapper.instance().map).toBeDefined();
});

it('should fit bounds', () => {
  shallow(
    <ComponentWithMap
      backgroundStyle=""
      fitBounds={{
        coordinates: [[1, 2], [3, 4]],
        padding: { top: 10, bottom: 10, left: 10, right: 10 },
      }}
    />,
  );
  expect(mapboxgl.Map).toHaveBeenCalledWith({
    container: null,
    attributionControl: false,
    style: '',
    center: undefined,
    zoom: 9,
    maxZoom: undefined,
    minZoom: undefined,
    maxBounds: undefined,
    preserveDrawingBuffer: false,
    hash: undefined,
    locale: {},
  });
  expect(mapboxgl.map.fitBounds).toHaveBeenCalledWith(
    [[1, 2], [3, 4]],
    { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
  );
});

it('should not call onMapLoaded if component is unmount', () => {
  const instance = new ComponentWithMap({
    onMapInit () {},
  });
  instance.setState = jest.fn();
  instance.componentWillUnmount();
  instance.initMap();
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should set instance in el for debug purpose', () => {
  const instance = new ComponentWithMap({
    onMapInit () {},
    onMapLoaded () {},
  });
  instance.setState = () => null;
  instance.containerEl.current = {};
  instance.initMap();
  expect(instance.containerEl.current.mapboxInstance).toBeDefined();
});

it('should not set center and fitbounds if hash is present', () => {
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();
  const wrapper = shallow(
    <ComponentWithMap
      backgroundStyle=""
      center={[1, 2]}
      fitBounds={{ coordinates: [] }}
      hash
    />,
  );
  const instance = wrapper.instance();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.Map.mock.calls[0][0].zoom).toBe(9);
  expect(mapboxgl.Map.mock.calls[0][0].center).toEqual([1, 2]);
  expect(mapboxgl.map.fitBounds).toHaveBeenCalled();
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();

  global.location.hash = '#hash';
  instance.initMap();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.Map.mock.calls[0][0].zoom).toBe(9);
  expect(mapboxgl.Map.mock.calls[0][0].center).toEqual([1, 2]);
  expect(mapboxgl.map.fitBounds).not.toHaveBeenCalled();
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();

  global.location.hash = '#10/3/4';
  instance.initMap();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.map.fitBounds).not.toHaveBeenCalled();
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();

  wrapper.setProps({ hash: false });
  instance.initMap();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.map.fitBounds).toHaveBeenCalled();
  global.location.hash = '';
});

it('should set center provided named hash', () => {
  const wrapper = shallow(
    <ComponentWithMap
      backgroundStyle=""
      center={[1, 2]}
      fitBounds={{ coordinates: [] }}
      hash="map"
    />,
  );
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();
  const instance = wrapper.instance();

  global.location.hash = '#foo=bar';
  instance.initMap();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.map.fitBounds).not.toHaveBeenCalled();
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();

  global.location.hash = '#map=10/3/4&foo=bar';
  instance.initMap();
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.map.fitBounds).not.toHaveBeenCalled();
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();
});


it('should layer added be order in respect with weight', () => {
  const wrapper = shallow(
    <ComponentWithMap
      backgroundStyle=""
      center={[1, 2]}
      fitBounds={{ coordinates: [] }}
      hash="map"
    />,
  );
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();
  const instance = wrapper.instance();
  instance.map.clearLayers();
  instance.initMap();

  instance.map.addLayer({
    id: 'layer1',
    type: 'fill',
  });
  instance.map.addLayer({
    id: 'layer2',
    type: 'circle',
  });
  instance.map.addLayer({
    id: 'layer3',
    type: 'background',
  });
  instance.map.addLayer({
    id: 'layer4',
    type: 'circle',
  });
  // Test forced weight
  instance.map.addLayer({
    id: 'layer5',
    type: 'circle',
    weight: 1,
  });
  // Test beforeId param
  instance.map.addLayer({
    id: 'layer6',
    type: 'heatmap',
    weight: 12,
  }, 'layer3');


  expect(instance.map.getStyle().layers).toEqual([
    {
      id: 'layer5',
      type: 'circle',
      weight: 1,
    }, {
      id: 'layer6',
      type: 'heatmap',
      weight: 12,
    },
    {
      id: 'layer3',
      type: 'background',
    },
    {
      id: 'layer1',
      type: 'fill',
    }, {
      id: 'layer2',
      type: 'circle',
    },
    {
      id: 'layer4',
      type: 'circle',
    },
  ]);

  instance.map.removeLayer({ id: 'layer3' });

  expect(instance.map.getStyle().layers).toEqual([
    {
      id: 'layer5',
      type: 'circle',
      weight: 1,
    }, {
      id: 'layer6',
      type: 'heatmap',
      weight: 12,
    },
    {
      id: 'layer1',
      type: 'fill',
    }, {
      id: 'layer2',
      type: 'circle',
    },
    {
      id: 'layer4',
      type: 'circle',
    },
  ]);
});

it('should layer added be order in respect with weight and draw layer', () => {
  const wrapper = shallow(
    <ComponentWithMap
      backgroundStyle=""
      center={[1, 2]}
      fitBounds={{ coordinates: [] }}
      hash="map"
    />,
  );
  mapboxgl.Map.mockClear();
  mapboxgl.map.fitBounds.mockClear();
  const instance = wrapper.instance();
  instance.map.clearLayers();
  instance.initMap();

  instance.map.addLayer({
    id: 'layer1',
    type: 'circle',
  });
  instance.map.addLayer({
    id: 'gl-draw-layer2',
    type: 'fill',
  });
  // Test forced weight
  instance.map.addLayer({
    id: 'gl-draw-layer5',
    type: 'fill',
    weight: 1,
  });
  // Test beforeId param
  instance.map.addLayer({
    id: 'gl-draw-layer6',
    type: 'fill',
    weight: 12,
  }, 'gl-draw-layer5');


  expect(instance.map.getStyle().layers).toEqual([
    {
      id: 'gl-draw-layer6',
      type: 'fill',
      weight: 12,
    },
    {
      id: 'gl-draw-layer5',
      type: 'fill',
      weight: 1,
    },
    {
      id: 'gl-draw-layer2',
      type: 'fill',
    },
    {
      id: 'layer1',
      type: 'circle',
    },
  ]);
});
