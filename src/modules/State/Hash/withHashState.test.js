import React from 'react';
import withHashState from './withHashState';
import { shallow } from 'enzyme';

const Component = jest.fn(() => null);
const ComponentWithHash = withHashState()(Component);

it('should get correct parameters', () => {
  window.location.hash = '#myparam=1&foo=bar&baz=false';

  const wrapper = shallow(
    <ComponentWithHash />,
  );
  expect(wrapper.props().initialState).toEqual({
    myparam: 1,
    foo: 'bar',
    baz: false,
  });
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
