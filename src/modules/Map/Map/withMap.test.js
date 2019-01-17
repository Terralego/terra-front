import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';

import withMap from './withMap';

jest.mock('mapbox-gl', () => {
  const map = {
    once: jest.fn((e, fn) => fn()),
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
  const tree = renderer.create(<ComponentWithMap backgroundStyle={{}} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have a map', () => {
  shallow(<ComponentWithMap backgroundStyle={{}} />);
  expect(mapboxgl.Map).toHaveBeenCalledWith({
    container: null,
    attributionControl: false,
    style: {},
    center: undefined,
    zoom: 9,
    maxZoom: undefined,
    minZoom: undefined,
    maxBounds: undefined,
  });
  expect(mapboxgl.map.once).toHaveBeenCalled();
  expect(Component).toHaveBeenCalledWith({
    map: mapboxgl.map,
    backgroundStyle: {},
    fitBounds: null,
    zoom: 9,
  }, {});
});

it('should have a map getter', () => {
  const wrapper = shallow(<ComponentWithMap backgroundStyle={{}} />);
  expect(wrapper.instance().map).toBe(mapboxgl.map);
});

it('should fit bounds', () => {
  shallow(<ComponentWithMap backgroundStyle={{}} fitBounds={[[1, 2], [3, 4]]} />);
  expect(mapboxgl.Map).toHaveBeenCalledWith({
    container: null,
    attributionControl: false,
    style: {},
    center: undefined,
    zoom: 9,
    maxZoom: undefined,
    minZoom: undefined,
    maxBounds: undefined,
  });
  expect(mapboxgl.map.fitBounds).toHaveBeenCalledWith([[1, 2], [3, 4]]);
});
