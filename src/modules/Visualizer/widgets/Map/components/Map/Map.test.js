import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import mapboxgl from 'mapbox-gl';
import { Map } from './Map';


const props = {
  map: mapboxgl.Map(),
  styles: {},
  accessToken: 'pk.eyJ1IjoidGFzdGF0aGFtMSIsImEiOiJjamZ1ejY2bmYxNHZnMnhxbjEydW9sM29hIn0.w9ndNH49d91aeyvxSjKQqg',
};

jest.mock('mapbox-gl', () => {
  const map = {
    addControl: jest.fn(() => {}),
    removeControl: jest.fn(() => {}),
    flyTo: jest.fn(() => {}),
    setMaxBounds: jest.fn(() => [
      [-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327], // France coordinates
    ]),
    setMaxZoom: jest.fn(() => 20),
    setMinZoom: jest.fn(() => 5),
    setStyle: jest.fn(() => 'mapbox://styles/mapbox/light-v9'),
    setLayoutProperty: jest.fn(),
    setPaintProperty: jest.fn(),
    on: jest.fn(),
    once (event, fn) {
      fn(map);
    },
    getStyle: jest.fn(() => ({ layers: [{ id: 'foo' }, { id: 'bar' }] })),
  };
  return {
    Map: jest.fn(() => map),
    ScaleControl: jest.fn(() => {}),
    NavigationControl: jest.fn(() => {}),
    AttributionControl: jest.fn(() => {}),
  };
});

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
    wrapper.setProps({ mapStyle: '' });
    expect(props.map.setStyle).toHaveBeenCalled();
  });

  it("should not call setStyle if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ styles: 'mapbox://styles/mapbox/light-v9' });
    expect(props.map.setStyle).not.toHaveBeenCalled();
  });

  it('should call addControl on init', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();
    expect(props.map.addControl).toHaveBeenCalledWith(instance.scaleControl);
    expect(props.map.addControl).toHaveBeenCalledWith(instance.navigationControl);
    expect(props.map.addControl).toHaveBeenCalledWith(instance.attributionControl);
    expect(props.map.addControl).toHaveBeenCalledTimes(3);
  });

  it('should not call removeControl on init', () => {
    shallow(<Map {...props} />);
    expect(props.map.removeControl).toHaveBeenCalledTimes(0);
  });

  it('should call addControl if true or removeControl if false', () => {
    const wrapper = shallow(<Map {...props} />);

    wrapper.setProps({ displayScaleControl: false });
    wrapper.setProps({ displayNavigationControl: false });
    wrapper.setProps({ displayAttributionControl: false });
    expect(props.map.addControl).toHaveBeenCalledTimes(3);
    expect(props.map.removeControl).toHaveBeenCalledTimes(3);

    wrapper.setProps({ displayScaleControl: true });
    wrapper.setProps({ displayNavigationControl: true });
    wrapper.setProps({ displayAttributionControl: true });
    expect(props.map.addControl).toHaveBeenCalledTimes(6);
    expect(props.map.removeControl).toHaveBeenCalledTimes(3);
  });
});


it('should update map', () => {
  const wrapper = shallow(<Map {...props} />);
  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', visibility: 'visible' }] } });
  expect(props.map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'visible');
  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', visibility: 'none' }] } });
  expect(props.map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'none');

  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', paint: { 'fill-color': '#000000' } }] } });
  expect(props.map.setPaintProperty).toHaveBeenCalledWith('foo', 'fill-color', '#000000');
});

it('should add click listener on each layers', () => {
  const wrapper = shallow(<Map {...props} />);
  expect(props.map.getStyle).toHaveBeenCalled();
  expect(wrapper.instance().clickListeners.length).toBe(2);
});

it('should add onClick listeners', () => {
  const wrapper = shallow(<Map {...props} />);
  const instance = wrapper.instance();
  instance.addClickListeners = jest.fn();
  wrapper.setProps({ onClick: () => null });
  expect(instance.addClickListeners).toHaveBeenCalled();
});

it('should display a tooltip', () => {
  const wrapper = shallow(<Map {...props} />);
  const instance = wrapper.instance();
  instance.displayTooltip = jest.fn();
  wrapper.setProps({ displayTooltip: {} });
  expect(instance.displayTooltip).toHaveBeenCalled();
});
