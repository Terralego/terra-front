import React from 'react';
import renderer from 'react-test-renderer';

import Radios from './Radios';

it('should render correctly', () => {
  const tree = renderer.create((
    <Radios
      values={[{ label: 'Foo', value: 'foo' }, { label: 'Bar', value: 'bar' }]}
      onChange={() => null}
      value={0}
    />
  ));
  expect(tree.toJSON()).toMatchSnapshot();
});

it('should handle change', () => {
  const onChange = jest.fn();
  const instance = new Radios({ onChange });
  instance.handleChange({ target: { value: 'foo' } });
  expect(onChange).toHaveBeenCalledWith('foo');
});

it('should update values', () => {
  expect(Radios.getDerivedStateFromProps({ })).toBe(null);
  expect(Radios.getDerivedStateFromProps({ values: ['foo', 'bar'] })).toEqual({
    values: [{
      value: 'foo',
      label: 'foo',
    }, {
      value: 'bar',
      label: 'bar',
    }],
  });
});
