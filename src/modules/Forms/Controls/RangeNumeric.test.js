import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
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

  act(() => {
    wrapper.find('NumericInput').last().prop('onValueChange')(10);
  });
  setTimeout(() => {
    expect(wrapper.find('NumericInput').last().prop('value')).toBe(10);
    expect(onChange).toHaveBeenCalled();
  });
});

it('should update range numeric if props are changed', () => {
  const wrapper = mount(<RangeNumeric max={1000} />);
  expect(wrapper.find('NumericInput').last().prop('value')).toBe(1000);
  wrapper.setProps({ value: [0, 500] });
  setTimeout(() => {
    expect(wrapper.find('NumericInput').last().prop('value')).toBe(500);
  });
});

it('should handle danger intent', () => {
  const onChange = jest.fn();
  const wrapper = mount(
    <RangeNumeric max={1000} onChange={onChange} value={[10, 20]} />,
  );
  act(() => {
    wrapper.find('NumericInput').first().prop('onValueChange')(30);
  });
  setTimeout(() => expect(wrapper.find('NumericInput').first().props().intent).toEqual('danger'));
  expect(onChange).not.toHaveBeenCalled();
});
