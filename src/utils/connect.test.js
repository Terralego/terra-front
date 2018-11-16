import React from 'react';
import { mount } from 'enzyme';
import connect from './connect';

it('should get props from a context', () => {
  let expected;
  const context = React.createContext();
  const { Provider } = context;
  const TestComponent = ({ foo }) => {
    expected = foo;
    return (
      <p>{foo}</p>
    );
  };
  const ConnectedTestComponent = connect(context)(state => state)(TestComponent);

  const wrapper = mount((
    <Provider value={{ foo: 'bar' }}>
      <ConnectedTestComponent />
    </Provider>
  ));

  expect(expected).toBe('bar');

  wrapper.setProps({ value: { foo: 'foo' } });

  expect(expected).toBe('foo');
});

it('should update only when connected props change', () => {
  let expected;
  const context = React.createContext();
  const { Provider } = context;
  const TestComponent = jest.fn(({ foo }) => {
    expected = foo;
    return (
      <p>{foo}</p>
    );
  });
  const contextConnect = connect(context);
  const ConnectedTestComponent =
    contextConnect(({ foo }) => ({ foo }))(TestComponent);

  const wrapper = mount((
    <Provider value={{ foo: 'bar', bar: 'foo' }}>
      <ConnectedTestComponent />
    </Provider>
  ));

  expect(TestComponent).toHaveBeenCalledWith({ foo: 'bar' }, {});
  expect(expected).toBe('bar');

  wrapper.setProps({ value: { foo: 'foo' } });

  expect(TestComponent).toHaveBeenCalledWith({ foo: 'foo' }, {});
  expect(expected).toBe('foo');

  TestComponent.mockClear();

  wrapper.setProps({ value: { foo: 'foo', bar: 'foo' } });

  expect(TestComponent).not.toHaveBeenCalled();
  expect(expected).toBe('foo');

  wrapper.setProps({ value: { foo: 'bar', bar: 'foo' } });

  expect(TestComponent).toHaveBeenCalledWith({ foo: 'bar' }, {});
  expect(expected).toBe('bar');
});

it('should chain many connect', () => {
  const context1 = React.createContext();
  const context2 = React.createContext();
  const { Provider: Provider1 } = context1;
  const { Provider: Provider2 } = context2;
  const TestComponent = jest.fn(({ a, b }) => <p>{a}, {b}</p>);
  const ConnectedComponent =
    connect(context1)(({ a }) => ({ a }))(connect(context2)(({ b }) => ({ b }))(TestComponent));
  mount((
    <Provider1 value={{ a: 'bar' }}>
      <Provider2 value={{ b: 'foo' }}>
        <ConnectedComponent />
      </Provider2>
    </Provider1>
  ));

  expect(TestComponent).toHaveBeenCalledWith({ a: 'bar', b: 'foo' }, {});
});

it('should find props from strings list', () => {
  const context = React.createContext();
  const { Provider } = context;
  const TestComponent = jest.fn(() => null);
  const ConnectedTestComponent = connect(context)('foo', 'bar')(TestComponent);

  mount((
    <Provider value={{ foo: 'bar', bar: 'foo', babar: 'fofoo' }}>
      <ConnectedTestComponent />
    </Provider>
  ));

  expect(TestComponent).toHaveBeenCalledWith({ foo: 'bar', bar: 'foo' }, {});
});

it('should find props from dotted strings', () => {
  const context = React.createContext();
  const { Provider } = context;
  const TestComponent = jest.fn(() => null);
  const ConnectedTestComponent = connect(context)({
    localFoo: 'foo',
    deepBabar: 'foo.bar.babar',
  })(TestComponent);

  mount((
    <Provider value={{ foo: { bar: { babar: 'foo' } } }}>
      <ConnectedTestComponent />
    </Provider>
  ));

  expect(TestComponent).toHaveBeenCalledWith({
    localFoo: { bar: { babar: 'foo' } },
    deepBabar: 'foo',
  }, {});
});

it('should use props to dive into state', () => {
  const context = React.createContext();
  const { Provider } = context;
  const TestComponent = jest.fn(() => null);
  const ConnectedTestComponent = connect(context)((state, props) => ({
    foo: state.getFoo(props.id),
  }))(TestComponent);

  const getFoo = jest.fn(id => ({ id: `foo:${id}` }));

  mount((
    <Provider value={{ getFoo }}>
      <ConnectedTestComponent
        id="42"
      />
    </Provider>
  ));

  expect(TestComponent).toHaveBeenCalledWith({
    id: '42',
    foo: { id: 'foo:42' },
  }, {});
  expect(getFoo).toHaveBeenCalledWith('42');
});
