import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';

import withMap from './withMap';

jest.mock('mapbox-gl', () => {
  const map = {
    once: jest.fn((e, fn) => fn()),
  };
  return {
    map,
    Map: jest.fn(() => map),
  };
});

const Component = jest.fn(() => null);
const ComponentWithMap = withMap(Component);

it('should render correctly', () => {
  const tree = renderer.create(<ComponentWithMap styles={{}} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have a map', () => {
  shallow(<ComponentWithMap styles={{}} />);
  expect(mapboxgl.Map).toHaveBeenCalled();
  expect(mapboxgl.map.once).toHaveBeenCalled();
  expect(Component).toHaveBeenCalledWith({
    map: mapboxgl.map,
    styles: {},
    zoom: 9,
  }, {});
});
