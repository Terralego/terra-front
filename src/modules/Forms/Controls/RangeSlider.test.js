import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import RangeSlider from './RangeSlider';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
}));

it('should handle slider change', () => {
  const onChange = jest.fn();
  const wrapper = mount(<RangeSlider onChange={onChange} />);
  act(() => {
    wrapper.find('RangeSlider').last().prop('onChange')([0, 10]);
  });
  setTimeout(() => {
    expect(wrapper.props().value).toEqual([0, 10]);
    expect(onChange).not.toHaveBeenCalled();
  });
});

it('should update range slider if max is reduced', () => {
  const wrapper = mount(<RangeSlider />);
  expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 100]);

  wrapper.setProps({ value: [0, 50] });
  setTimeout(() => expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 50]));
});

it('should not update range if wrong value', () => {
  const wrapper = mount(<RangeSlider />);
  expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 100]);

  wrapper.setProps({ value: [150] });
  setTimeout(() => expect(wrapper.find('RangeSlider').last().props().value).toEqual([0, 100]));
});
