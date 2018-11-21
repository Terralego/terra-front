import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Map } from './';

const props = {
  styles: {},
  accessToken: 'pk.eyJ1IjoidGFzdGF0aGFtMSIsImEiOiJjamZ1ejY2bmYxNHZnMnhxbjEydW9sM29hIn0.w9ndNH49d91aeyvxSjKQqg',
};

jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
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
  })),
  ScaleControl: jest.fn(),
  NavigationControl: jest.fn(),
  AttributionControl: jest.fn(),
}));

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
    expect(wrapper.instance().map.flyTo).toHaveBeenCalled();
    expect(wrapper.instance().props.flyTo).toBe(flyTo);
  });

  it('should call flyTo and not update flyTo property', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 9 });
    expect(wrapper.instance().map.flyTo).not.toHaveBeenCalled();
  });

  it('should call setMaxBound on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: [[0, 0], [0, 0]] });
    expect(wrapper.instance().map.setMaxBounds).toHaveBeenCalled();
  });

  it("should not call setMaxBound if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxBounds: false });
    expect(wrapper.instance().map.setMaxBounds).not.toHaveBeenCalled();
  });

  it('should call setMaxZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 7 });
    expect(wrapper.instance().map.setMaxZoom).toHaveBeenCalled();
  });

  it("should not call setMaxZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ maxZoom: 20 });
    expect(wrapper.instance().map.setMaxZoom).not.toHaveBeenCalled();
  });

  it('should call setMinZoom on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 7 });
    expect(wrapper.instance().map.setMinZoom).toHaveBeenCalled();
  });

  it("should not call setMinZoom if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ minZoom: 0 });
    expect(wrapper.instance().map.setMinZoom).not.toHaveBeenCalled();
  });

  it('should call setStyle on property change', () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ mapStyle: '' });
    expect(wrapper.instance().map.setStyle).toHaveBeenCalled();
  });

  it("should not call setStyle if property doesn't change", () => {
    const wrapper = shallow(<Map {...props} />);
    wrapper.setProps({ styles: 'mapbox://styles/mapbox/light-v9' });
    expect(wrapper.instance().map.setStyle).not.toHaveBeenCalled();
  });

  it('should call addControl on init', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();
    expect(instance.map.addControl).toHaveBeenCalledWith(instance.scaleControl);
    expect(instance.map.addControl).toHaveBeenCalledWith(instance.navigationControl);
    expect(instance.map.addControl).toHaveBeenCalledWith(instance.attributionControl);
    expect(instance.map.addControl).toHaveBeenCalledTimes(3);
  });

  it('should not call removeControl on init', () => {
    const wrapper = shallow(<Map {...props} />);
    expect(wrapper.instance().map.removeControl).toHaveBeenCalledTimes(0);
  });

  it('should call addControl if true or removeControl if false', () => {
    const wrapper = shallow(<Map {...props} />);
    const instance = wrapper.instance();

    wrapper.setProps({ displayScaleControl: false });
    wrapper.setProps({ displayNavigationControl: false });
    wrapper.setProps({ displayAttributionControl: false });
    expect(instance.map.addControl).toHaveBeenCalledTimes(3);
    expect(instance.map.removeControl).toHaveBeenCalledTimes(3);

    wrapper.setProps({ displayScaleControl: true });
    wrapper.setProps({ displayNavigationControl: true });
    wrapper.setProps({ displayAttributionControl: true });
    expect(instance.map.addControl).toHaveBeenCalledTimes(6);
    expect(instance.map.removeControl).toHaveBeenCalledTimes(3);
  });
});

it('should render div', () => {
  const wrapper = shallow(<Map {...props} />);
  expect(wrapper.find('div').hasClass('tf-map')).toEqual(true);
  expect(wrapper.find('div').length).toBe(1);
});

it('should have a ref', () => {
  const wrapper = shallow(<Map {...props} />);
  expect(wrapper.instance().containerEl).toEqual(React.createRef());
});

it('should update map', () => {
  const wrapper = shallow(<Map {...props} />);
  const { map } = wrapper.instance();
  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', visibility: 'visible' }] } });
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'visible');
  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', visibility: 'none' }] } });
  expect(map.setLayoutProperty).toHaveBeenCalledWith('foo', 'visibility', 'none');

  wrapper.setProps({ stylesToApply: { layouts: [{ id: 'foo', paint: { 'fill-color': '#000000' } }] } });
  expect(map.setPaintProperty).toHaveBeenCalledWith('foo', 'fill-color', '#000000');
});
