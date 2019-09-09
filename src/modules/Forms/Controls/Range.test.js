import { shallow, mount } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-dom/test-utils';

import Range from './Range';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
  FormGroup: ({ children }) => <div>{children}</div>,
  NumericInput: () => <p>Numeric input</p>,
  Intent: { DANGER: 'danger' },
}));

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

it('should handle numeric change', () => {
  const onChange = jest.fn();
  const wrapper = mount(<Range max={1000} onChange={onChange} />);
  expect(wrapper.find('RangeNumeric').props().value).toEqual([0, 1000]);

  act(() => {
    wrapper.find('NumericInput').last().prop('onValueChange')(10);
  });
  setTimeout(() => {
    expect(wrapper.find('RangeNumeric').props().value).toEqual([0, 10]);
    expect(onChange).toHaveBeenCalled();
  });
});

it('should update range numeric if props are changed', () => {
  const wrapper = mount(<Range max={1000} />);
  expect(wrapper.find('RangeNumeric').props().value).toEqual([0, 1000]);
  wrapper.setProps({ value: [0, 500] });
  expect(wrapper.find('RangeNumeric').props().value).toEqual([0, 500]);
});

it('should handle danger intent', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <Range max={1000} onChange={onChange} value={[10, 20]} />,
  );
  act(() => {
    wrapper.find('NumericInput').first().prop('onValueChange')(30);
  });
  setTimeout(() => expect(wrapper.find('NumericInput').first().props().intent).toEqual('danger'));
  expect(onChange).not.toHaveBeenCalled();
});
