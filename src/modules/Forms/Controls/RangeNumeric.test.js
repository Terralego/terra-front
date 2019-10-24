import React from 'react';
import { mount } from 'enzyme';
import RangeNumeric from './RangeNumeric';

jest.mock('@blueprintjs/core', () => ({
  FormGroup: ({ children }) => <div>{children}</div>,
  NumericInput: () => <p>Numeric input</p>,
  Intent: { DANGER: 'danger' },
}));

it('should handle numeric change', () => {
  const onChange = jest.fn();
  const wrapper = mount(<RangeNumeric onChange={onChange} />);
  expect(wrapper.find('NumericInput').last().prop('value')).toBe(100);

  wrapper.find('NumericInput').last().invoke('onValueChange')(10);
  expect(wrapper.find('NumericInput').last().prop('value')).toBe(10);
  expect(onChange).toHaveBeenCalled();
});

it('should allow typing minus', () => {
  const instance = new RangeNumeric({});
  instance.setState = jest.fn();
  instance.onNumericInputChange(0)('-');
  expect(instance.setState).not.toHaveBeenCalled();
});

it('should update range numeric if props are changed', () => {
  const wrapper = mount(<RangeNumeric max={1000} />);
  expect(wrapper.state().range).toEqual([0, 1000]);
  wrapper.setProps({ value: [0, 500] });
  expect(wrapper.state().range).toEqual([0, 500]);
});

it('should handle danger intent', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <RangeNumeric max={1000} onChange={onChange} value={[10, 20]} />,
  );
  wrapper.find('NumericInput').first().prop('onValueChange')(30);
  wrapper.update();
  expect(wrapper.find('NumericInput').first().props().intent).toEqual('danger');
  expect(onChange).not.toHaveBeenCalled();
});

it('should not take consideration of props min or max', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <RangeNumeric max={1000} min={100} onChange={onChange} value={[10, 20]} />,
  );
  expect(wrapper.find('NumericInput').first().props().min).toEqual(null);
  expect(wrapper.find('NumericInput').first().props().max).toEqual(null);
  wrapper.find('NumericInput').first().prop('onValueChange')(0);
  expect(onChange).toHaveBeenCalledWith([0, 20]);
});
