import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Checkboxes from './Checkboxes';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Checkboxes
      label="Pwout"
      onChange={() => null}
      values={['pwet', 'wxd']}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Checkboxes
      label="Pwout"
      onChange={onChange}
      values={['pwet', 'wxd']}
      value={['foo']}
    />
  ));

  wrapper.instance().onToggle('pwet');
  expect(onChange).toHaveBeenCalledWith(['foo', 'pwet']);
  wrapper.instance().onToggle('foo');
  expect(onChange).toHaveBeenCalledWith([]);
});

it('should update values', () => {
  expect(Checkboxes.getDerivedStateFromProps({ })).toBe(null);
  expect(Checkboxes.getDerivedStateFromProps({ values: ['foo', 'bar'] })).toEqual({
    values: [{
      value: 'foo',
      label: 'foo',
    }, {
      value: 'bar',
      label: 'bar',
    }],
  });
});
