import React from 'react';
import { shallow } from 'enzyme';

import withDeviceSize from './withDeviceSize';

jest.mock('lodash.debounce', () => fn => () => fn());

const Component = ({ isMobileSized, isPhoneSized }) => {
  if (isPhoneSized) { return <p>phone</p>; }
  if (isMobileSized) { return <p>Mobile</p>; }
  return null;
};

const ComponentWithDeviceSize = withDeviceSize()(Component);

it('should check breakpoints device', () => {
  global.innerWidth = 2000;
  const wrapper = shallow(
    <ComponentWithDeviceSize />,
  );

  global.dispatchEvent(new Event('resize'));

  expect(wrapper.props().isPhoneSized).toBe(false);
  expect(wrapper.props().isMobileSized).toBe(false);

  global.innerWidth = 1000;

  global.dispatchEvent(new Event('resize'));

  expect(wrapper.props().isPhoneSized).toBe(false);
  expect(wrapper.props().isMobileSized).toBe(true);

  global.innerWidth = 300;

  global.dispatchEvent(new Event('resize'));

  expect(wrapper.props().isPhoneSized).toBe(true);
  expect(wrapper.props().isMobileSized).toBe(true);
});

it('should add a listerner', () => {
  const instance = new ComponentWithDeviceSize();
  jest.spyOn(global, 'addEventListener');
  instance.updateWindowDimensions = jest.fn();
  instance.componentDidMount();
  expect(instance.updateWindowDimensions).toHaveBeenCalled();
});

it('should remove a listerner', () => {
  const instance = new ComponentWithDeviceSize();
  const spy = jest.spyOn(global, 'removeEventListener');
  instance.updateWindowDimensions = jest.fn();
  instance.componentWillUnmount();
  expect(spy).toHaveBeenCalled();
});

it('should update window dimensions', () => {
  const wrapper = shallow(
    <ComponentWithDeviceSize />,
  );
  wrapper.update();
});
