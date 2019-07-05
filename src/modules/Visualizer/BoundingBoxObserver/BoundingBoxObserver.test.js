import React from 'react';
import { shallow } from 'enzyme';
import ResizeObserver from 'resize-observer-polyfill';

import BoundingBoxObserver from './BoundingBoxObserver';

jest.mock('resize-observer-polyfill', () => {
  const ResizeObserverMockInstance = {
    observe: jest.fn(),
  };
  const ResizeObserverMock = jest.fn(callback => {
    ResizeObserverMockInstance.callback = callback;
    return ResizeObserverMockInstance;
  });
  ResizeObserverMock.instance = ResizeObserverMockInstance;
  return ResizeObserverMock;
});

it('should observe children', () => {
  const onChange = jest.fn();
  const wrapper = shallow(
    <BoundingBoxObserver
      onChange={onChange}
    >
      {() => null}
    </BoundingBoxObserver>,
  );
  const instance = wrapper.instance();
  expect(ResizeObserver).toHaveBeenCalled();
  expect(instance.ro.observe).toHaveBeenCalledWith(instance.ref.current);

  const target = {
    getBoundingClientRect: jest.fn(() => ({ top: 42 })),
  };
  instance.ro.callback([{ target }]);
  expect(target.getBoundingClientRect).toHaveBeenCalled();
  expect(onChange).toHaveBeenCalledWith({ top: 42 });
});

it('should disconnect observer on unmount', () => {
  const instance = new BoundingBoxObserver();
  instance.ro = { disconnect: jest.fn() };
  instance.componentWillUnmount();
  expect(instance.ro.disconnect).toHaveBeenCalled();
});

it('should observe children component', () => {
  const Test = () => null;
  const wrapper = shallow(
    <BoundingBoxObserver
      as={Test}
    />,
  );
  expect(wrapper.find('Test')).toBeDefined();
});
