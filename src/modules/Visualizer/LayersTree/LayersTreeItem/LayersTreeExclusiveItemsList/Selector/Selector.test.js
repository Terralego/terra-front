import React from 'react';
import renderer from 'react-test-renderer';

import Selector from './Selector';

jest.mock('uuid/v4', () => () => 'uuid');

it('should render', () => {
  const tree = renderer.create(
    <Selector
      selectors={[{
        label: 'Foo',
        name: 'foo',
        values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
      }, {
        label: 'Bar',
        name: 'bar',
        values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
      }]}
      layers={[{
        label: 'Layer 1',
        selectorKey: {
          foo: 'foo',
          bar: 'foo',
        },
      }, {
        label: 'Layer 1',
        selectorKey: {
          foo: 'foo',
          bar: 'bar',
        },
      }]}
      activeLayer={{
        selectorKey: {
          foo: 'foo',
          bar: 'foo',
        },
      }}
    />,
  );
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should render an error message', () => {
  const tree = renderer.create(
    <Selector
      selectors={[{
        label: 'Foo',
        name: 'foo',
        values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
      }, {
        label: 'Bar',
        name: 'bar',
        values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
      }]}
      layers={[{
        label: 'Layer 1',
        selectorKey: {
          foo: 'foo',
          bar: 'foo',
        },
      }, {
        label: 'Layer 1',
        selectorKey: {
          foo: 'foo',
          bar: 'bar',
        },
      }]}
      activeLayer={{
        selectorKey: {
          foo: 'foo',
          bar: 'foo',
        },
      }}
    />,
  );
  tree.getInstance().setState({ noMatchingLayer: true });
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should change layer', () => {
  const selectors = [{
    label: 'Foo',
    name: 'foo',
    values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
  }, {
    label: 'Bar',
    name: 'bar',
    values: [{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }],
  }];
  const layers = [{
    label: 'Layer 1',
    selectorKey: {
      foo: 'foo',
      bar: 'foo',
    },
  }, {
    label: 'Layer 1',
    selectorKey: {
      foo: 'foo',
      bar: 'bar',
    },
  }];
  const onChange = jest.fn();
  const instance = new Selector({
    selectors,
    layers,
    activeLayer: layers[0],
    onChange,
  });
  instance.setState = jest.fn();
  instance.onChange('bar')('bar');
  expect(onChange).toHaveBeenCalledWith(1);
  expect(instance.setState).toHaveBeenCalledWith({ noMatchingLayer: false });
  onChange.mockClear();
  instance.setState.mockClear();

  instance.onChange('bar')('lorem');
  expect(onChange).not.toHaveBeenCalledWith(1);
  expect(instance.setState).toHaveBeenCalledWith({ noMatchingLayer: true });
});
