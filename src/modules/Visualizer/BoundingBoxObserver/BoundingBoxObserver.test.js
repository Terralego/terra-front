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
  let expected;
  const onChange = jest.fn();
  const wrapper = shallow(
    <BoundingBoxObserver
      onChange={onChange}
    >
      {({ ref }) => { expected = ref; }}
    </BoundingBoxObserver>,
  );
  const instance = wrapper.instance();
  expect(expected).toBe(instance.ref);
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
  let expected;
  const Test = ({ ref }) => { expected = ref; };
  const wrapper = shallow(
    <BoundingBoxObserver
      as={Test}
    />,
  );
  const test = wrapper.find('Test');
  expect(expected).toBe(test.props().ref);
});
