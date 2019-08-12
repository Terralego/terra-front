import React from 'react';
import { shallow } from 'enzyme';
import withHashState from './withHashState';

const Component = jest.fn(() => null);
const ComponentWithHash = withHashState()(Component);

it('should not set listeners', () => {
  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window.history, 'replaceState');

  const wrapper = shallow(
    <ComponentWithHash listenHash={false} updateHash={false} />,
  );
  const instance = wrapper.instance();
  expect(window.addEventListener).not.toHaveBeenCalled();

  instance.updateHashString({ foo: 'bar' });
  expect(window.history.replaceState).not.toHaveBeenCalled();
});

it('should get correct parameters', () => {
  jest.spyOn(window, 'addEventListener');
  jest.spyOn(window, 'removeEventListener');

  window.location.hash = '#myparam=1&foo=bar&baz=false';

  const wrapper = shallow(
    <ComponentWithHash />,
  );
  const listener = wrapper.instance().onHashChange;
  expect(window.addEventListener).toHaveBeenCalledWith('hashchange', listener, false);
  listener();

  const { initialState } = wrapper.props();
  expect(initialState).toEqual({
    myparam: 1,
    foo: 'bar',
    baz: false,
  });
  expect(wrapper.instance().getCurrentHashString(initialState)).toEqual(window.location.hash);

  wrapper.unmount();
  expect(window.removeEventListener).toHaveBeenCalledWith('hashchange', listener, false);
  listener();
});

it('should set correct parameters', () => {
  const instance = shallow(
    <ComponentWithHash />,
  ).instance();

  instance.updateHashString({ myparam: 1 });
  expect(window.location.hash).toEqual('#myparam=1');

  instance.updateHashString({ myparam: 1, foo: 'bar' });
  expect(window.location.hash).toEqual('#myparam=1&foo=bar');

  instance.updateHashString({ myparam: 0, baz: false });
  expect(window.location.hash).toEqual('#myparam=0&baz=false');
});
