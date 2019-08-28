import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import PermalinkControl from './PermalinkControl';

jest.mock('@blueprintjs/core', () => ({
  Button: ({ children = 'Button' }) => children,
  ControlGroup: ({ children }) => children,
  Icon: ({ children = 'Icon' }) => children,
  Popover: ({ children }) => children,
  PopoverPosition: {},
  Tooltip: ({ children }) => children,
}));

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

it('should display correct url with map named', () => {
  window.location.href = 'http://localhost/#map=foobar&bar=false';
  const instance = new PermalinkControl({
    hash: 'map',
    initialState: {
      foo: 'bar',
      baz: false,
    },
  });
  instance.setState = jest.fn();
  instance.generateHashString();
  expect(instance.setState).toHaveBeenCalledWith({ url: 'http://localhost/#foo=bar&baz=false&map=foobar' });
});

it('should permit copy to clipboard', () => {
  jest.useFakeTimers();
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
  const instance = wrapper.instance();

  wrapper.find('.bp3-input').props().onClick({
    target: {
      setSelectionRange: selectionRange,
      value: 'coucou',
    },
  });

  instance.inputRef.current = {
    setSelectionRange: jest.fn(),
    focus: jest.fn(),
    value: 'coucou',
  };
  instance.copyToCliboard();
  expect(document.execCommand).toHaveBeenCalledWith('copy');
  expect(instance.state).toEqual({ copySuccess: true });
  jest.runAllTimers();
  expect(instance.state).toEqual({ copySuccess: false });
});
