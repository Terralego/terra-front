import { mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import ShareControl, { icon } from './ShareControl';

jest.mock('@blueprintjs/core', () => ({
  Button: ({ children = 'Button' }) => children,
  ControlGroup: ({ children }) => children,
  Icon: ({ children = 'Icon' }) => children,
  Popover: ({ children }) => children,
  PopoverPosition: {},
  Tooltip: ({ children }) => children,
}));

jest.mock('react-dom', () => ({
  createPortal: node => node,
}));

window.open = jest.fn();

it('should render', () => {
  const tree = renderer.create(<ShareControl />);
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should display correct url', () => {
  const instance = new ShareControl({
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
  const instance = new ShareControl({
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
    <ShareControl
      usePortal={false}
      initialState={{
        foo: 'bar',
        baz: false,
      }}
    />,
  );
  // const selectionRange = jest.fn();
  const instance = wrapper.instance();
  // console.log(wrapper.find('.bp3-input') ? 'youpi' : 'nope');
  // wrapper
  //   .find('.bp3-input')
  //   .props()
  //   .onClick({
  //     target: {
  //       setSelectionRange: selectionRange,
  //       value: 'coucou',
  //     },
  //   });

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

it('should get no icon', () => {
  expect(icon()).toBeNull();
});

it('should share', () => {
  const instance = new ShareControl({});
  instance.state.url = 'foo';
  jest.spyOn(global, 'open');

  instance.share('twitter')();
  expect(global.open).toHaveBeenCalledWith('https://twitter.com/intent/tweet?url=foo');
  global.open.mockClear();

  instance.share('facebook')();
  expect(global.open).toHaveBeenCalledWith('https://www.facebook.com/sharer/sharer.php?u=foo');
  global.open.mockClear();

  instance.share('linkedin')();
  expect(global.open).toHaveBeenCalledWith('https://www.linkedin.com/shareArticle?mini=true&url=foo');
  global.open.mockClear();

  instance.share()();
  expect(global.open).not.toHaveBeenCalled();
  global.open.mockClear();
});
