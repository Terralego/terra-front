import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Range from './Range';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
}));

it('should render correctly', () => {
  const tree = renderer.create((
    <Range
      label="My range"
      values={[1, 4]}
      onChange={() => null}
      min={0}
      max={10}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Range
      label="Change Values of my range"
      onChange={onChange}
      values={[10, 30]}
      min={0}
      max={100}
    />
  ));
  wrapper.find('RangeSlider').props().onChange([20, 40]);
  expect(onChange).toHaveBeenCalled();
});

it('should throw an error when values are incorrect', () => {
  const ERROR_MESSAGE =  'Range control: There must be two values and the first must be less than the second';
  expect(() => Range({ value: [10] })).toThrow(ERROR_MESSAGE);
  expect(() => Range({ value: [30, 10] })).toThrow(ERROR_MESSAGE);
});
