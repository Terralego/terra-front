import React from 'react';
import { shallow } from 'enzyme';
import StateProvider from './StateProvider';


it('should set state', () => {
  const onStateChange = jest.fn();
  const wrapper = shallow(
    <StateProvider
      initialState={{ foo: 'bar' }}
      onStateChange={onStateChange}
    />,
  );

  expect(wrapper.state()).toEqual({ foo: 'bar' });

  wrapper.instance().setCurrentState({ foo: 'baz' });
  expect(wrapper.state()).toEqual({ foo: 'baz' });
  expect(onStateChange).toHaveBeenCalled();
});
