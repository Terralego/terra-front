import { shallow, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';

import Range from './Range';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
  FormGroup: ({ children }) => <div>{children}</div>,
  NumericInput: () => <p>Numeric input</p>,
  Intent: { DANGER: 'danger' },
  Spinner: () => <p>Spinner</p>,
}));

it('should render correctly loading', () => {
  const tree = renderer.create((
    <Range loading label="Pwout" />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly as range slider', () => {
  const tree = renderer.create((
    <Range
      label="My range"
      value={[1, 4]}
      onChange={() => null}
      min={0}
      max={10}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render correctly as two inputs', () => {
  const tree = renderer.create((
    <Range
      label="My range"
      value={[1, 4]}
      onChange={() => null}
      min={0}
      max={1000}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = mount((
    <Range
      label="Change Values of my range"
      onChange={onChange}
      values={[10, 30]}
      min={0}
      max={100}
    />
  ));
  wrapper.find('RangeSlider').last().props().onRelease([20, 40]);
  expect(onChange).toHaveBeenCalled();
});

it('should render correctly with default min and max when no value', () => {
  const wrapper = shallow(<Range />);
  expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 100]);
});

it('should render correctly with default min and max if wrong value', () => {
  const wrapper = shallow(<Range value={[123]} />);
  expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 100]);
});
