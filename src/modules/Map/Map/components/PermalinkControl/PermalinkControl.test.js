import { Popover } from '@blueprintjs/core';
import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import PermalinkControl from './PermalinkControl';

it('should render', () => {
  const tree = renderer.create(<PermalinkControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should display correct url', () => {
  const instance = new PermalinkControl({
    initialState: {
      foo: 'bar',
      baz: false,
    },
  });
  instance.setState = jest.fn();
  instance.generateHashString();
  expect(instance.setState).toHaveBeenCalledWith({ url: 'http://localhost/#foo=bar&baz=false' });
});

it('should permit copy to clipboard', () => {
  document.execCommand = jest.fn();

  const wrapper = mount(
    <PermalinkControl
      initialState={{
        foo: 'bar',
        baz: false,
      }}
    />,
  );
  const selectionRange = jest.fn();

  wrapper.find(Popover).setState({ isOpen: true });
  wrapper.find('.bp3-input').props().onClick({
    target: {
      setSelectionRange: selectionRange,
      value: 'coucou',
    },
  });

  wrapper.instance().inputRef.current = {
    setSelectionRange: jest.fn(),
    focus: jest.fn(),
    value: 'coucou',
  };
  wrapper.instance().copyToCliboard();
  expect(document.execCommand).toHaveBeenCalledWith('copy');
  expect(wrapper.instance().state).toEqual({ copySuccess: true });
});
