import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import Selector from './Selector';

jest.mock('uuid/v4', () => () => 'uuid');

it('should render', () => {
  const { asFragment } = render(
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
  expect(asFragment()).toMatchSnapshot();
});

it('should render even without selector', () => {
  const { asFragment } = render(
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
      activeLayer={{}}
    />,
  );
  expect(asFragment()).toMatchSnapshot();
});

it('should render an error message', async () => {
  const { asFragment } = render(
    <Selector
      selectors={[{
        label: 'Foo',
        name: 'foo',
        values: [{ label: 'Foo1', value: 'foo' }, { label: 'Bar1', value: 'bar' }],
      }, {
        label: 'Bar',
        name: 'bar',
        values: [{ label: 'Foo2', value: 'foo' }, { label: 'Bar2', value: 'bar' }],
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
          foo: 'bar', // Layer with this selector don't exists
          bar: 'foo',
        },
      }}
    />,
  );

  expect(asFragment()).toMatchSnapshot();
});

it('should change layer', async () => {
  const selectors = [{
    label: 'Foo',
    name: 'foo',
    values: [{ label: 'Foo1', value: 'foo' }, { label: 'Bar1', value: 'bar' }],
  }, {
    label: 'Bar',
    name: 'bar',
    values: [{ label: 'Foo2', value: 'foo' }, { label: 'Bar2', value: 'bar' }, { label: 'Baz2', value: 'baz' }],
  }];
  const layers = [{
    label: 'Layer 1',
    selectorKey: {
      foo: 'foo',
      bar: 'foo',
    },
  }, {
    label: 'Layer 2',
    selectorKey: {
      foo: 'foo',
      bar: 'bar',
    },
  }, {
    label: 'Layer 3',
    selectorKey: {
      foo: 'bar',
      bar: 'foo',
    },
  }, {
    label: 'Layer 4',
    selectorKey: {
      foo: 'bar',
      bar: 'bar',
    },
  }];
  const onChange = jest.fn();

  const { asFragment } = render(
    <Selector
      selectors={selectors}
      layers={layers}
      activeLayer={layers[0]}
      onChange={onChange}
    />,
  );

  // First selector
  fireEvent.click(screen.getByText('Foo1'));
  fireEvent.click(screen.getByText('Bar1'));

  expect(onChange).toHaveBeenLastCalledWith(2);

  onChange.mockClear();

  // Second selector
  fireEvent.click(screen.getByText('Foo2'));

  fireEvent.click(screen.getByText('Bar2'));

  expect(onChange).toHaveBeenLastCalledWith(1);

  onChange.mockClear();

  fireEvent.click(screen.getByText('Baz2')); // Selector with no layer

  expect(onChange).not.toHaveBeenCalled();

  expect(asFragment()).toMatchSnapshot();
});
