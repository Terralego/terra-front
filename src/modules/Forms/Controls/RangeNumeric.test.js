import React from 'react';
import { mount } from 'enzyme';
import RangeNumeric from './RangeNumeric';

jest.mock('lodash.debounce', () => fn => param => fn(param));

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


it('should reset range if value are minmaxed', () => {
  const onChange = jest.fn();
  const wrapper = mount(<RangeNumeric min={10} max={90} onChange={onChange} />);

  wrapper.find('NumericInput').first().prop('onValueChange')(30);
  wrapper.find('NumericInput').last().prop('onValueChange')(80);
  wrapper.update();

  expect(onChange).toHaveBeenLastCalledWith([30, 80]);


  wrapper.find('NumericInput').first().prop('onValueChange')(10);
  wrapper.find('NumericInput').last().prop('onValueChange')(90);
  wrapper.update();

  expect(onChange).toHaveBeenLastCalledWith(undefined);
});

it('should handle danger intent', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <RangeNumeric min={10} max={1000} onChange={onChange} value={[10, 20]} />,
  );
  wrapper.find('NumericInput').first().prop('onValueChange')(30);
  wrapper.update();
  expect(wrapper.find('NumericInput').first().props().intent).toEqual('danger');

  expect(onChange).not.toHaveBeenCalled();
  onChange.mockClear();

  wrapper.find('NumericInput').first().prop('onValueChange')(10);
  wrapper.update();

  expect(wrapper.find('NumericInput').first().props().intent).toEqual(undefined);
  expect(onChange).toHaveBeenCalled();
  onChange.mockClear();

  wrapper.find('NumericInput').first().prop('onValueChange')(8);
  wrapper.update();

  expect(wrapper.find('NumericInput').first().props().intent).toEqual(undefined);
  expect(onChange).toHaveBeenCalled();
  onChange.mockClear();

  wrapper.find('NumericInput').first().prop('onValueChange')(10);
  wrapper.update();

  expect(wrapper.find('NumericInput').first().props().intent).toEqual(undefined);
  expect(onChange).toHaveBeenCalled();
  onChange.mockClear();

  wrapper.find('NumericInput').last().prop('onValueChange')(1001);
  wrapper.update();

  expect(wrapper.find('NumericInput').last().props().intent).toEqual(undefined);
  expect(onChange).toHaveBeenCalled();
  onChange.mockClear();
});

it('should not take consideration of props min or max', () => {
  const wrapper = mount(
    <RangeNumeric max={1000} min={100} value={[10, 20]} />,
  );
  expect(wrapper.find('NumericInput').first().props().min).toEqual(undefined);
  expect(wrapper.find('NumericInput').first().props().max).toEqual(undefined);
  wrapper.find('NumericInput').first().prop('onValueChange')(0);
});
