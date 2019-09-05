import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

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
      values={[1, 4]}
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
      values={[1, 4]}
      onChange={() => null}
      min={0}
      max={1000}
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
  wrapper.find('RangeSlider').props().onRelease([20, 40]);
  expect(onChange).toHaveBeenCalled();
});

it('should get default min and max if no value', () => {
  const instance = new Range({});
  expect(instance.state).toEqual({
    range: [0, 100],
  });
});

it('should get default min and max if wrong value', () => {
  const instance = new Range({ value: ['foo'] });
  expect(instance.state).toEqual({
    range: [0, 100],
  });
});

it('should update range if props are changed', () => {
  const wrapper = shallow(<Range />);
  expect(wrapper.state().range).toEqual([0, 100]);
  wrapper.setProps({ value: [0, 50] });
  expect(wrapper.state().range).toEqual([0, 50]);
  wrapper.find('RangeSlider').props().onChange([10, 20]);
  expect(wrapper.state().range).toEqual([10, 20]);

  wrapper.setProps({ min: -100, max: 50 });
  expect(wrapper.state().range).toEqual([-100, 50]);
});

it('should handle numeric change', () => {
  const onChange = jest.fn();
  const wrapper = shallow(<Range max={1000} onChange={onChange} />);
  const instance = wrapper.instance();

  instance.onNumericInputChange(1)(10);
  expect(wrapper.state().range).toEqual([0, 10]);
  expect(onChange).toHaveBeenCalled();
});

it('should handle danger intent', () => {
  const onChange = jest.fn();
  const wrapper = shallow(
    <Range max={1000} onChange={onChange} value={[10, 20]} />,
  );
  const instance = wrapper.instance();

  instance.onNumericInputChange(0)(30);
  expect(wrapper.state().range).toEqual([30, 20]);
  expect(wrapper.find('NumericInput').first().props().intent).toEqual('danger');
  expect(onChange).not.toHaveBeenCalled();
});
