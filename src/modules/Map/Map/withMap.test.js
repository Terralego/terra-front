import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';

import withMap from './withMap';

jest.mock('mapbox-gl', () => {
  const map = {
    once: jest.fn((e, fn) => fn()),
    on: jest.fn((e, fn) => fn()),
    fitBounds: jest.fn(),
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
  });
  expect(mapboxgl.map.once).toHaveBeenCalled();
  expect(Component).toHaveBeenCalled();
  const attrs = Component.mock.calls[0][0];
  expect(attrs.map).toBe(mapboxgl.map);
  expect(attrs.backgroundStyle).toEqual('');
  expect(attrs.fitBounds).toBe(null);
  expect(attrs.zoom).toEqual(9);
});

it('should have a map getter', () => {
  const wrapper = shallow(<ComponentWithMap backgroundStyle="" />);
  expect(wrapper.instance().map).toBe(mapboxgl.map);
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
  expect(instance.containerEl.current.mapboxInstance).toBe(mapboxgl.map);
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
