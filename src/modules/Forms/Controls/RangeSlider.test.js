import React from 'react';
import { mount } from 'enzyme';

import RangeSlider from './RangeSlider';

jest.mock('@blueprintjs/core', () => ({
  RangeSlider: () => <p>Range</p>,
}));

it('should handle slider change', () => {
  const onChange = jest.fn();
  const wrapper = mount(<RangeSlider onChange={onChange} />);
  expect(wrapper.state().range).toEqual([0, 100]);

  wrapper.find('RangeSlider').last().prop('onChange')([0, 10]);
  expect(wrapper.state().range).toEqual([0, 10]);
  expect(onChange).not.toHaveBeenCalled();
});

it('should update range slider if max is reduced', () => {
  const wrapper = mount(<RangeSlider />);
  expect(wrapper.state().range).toEqual([0, 100]);

  wrapper.setProps({ max: 50 });
  expect(wrapper.state().range).toEqual([0, 50]);
});

it('should update range within bounds if max is reduced', () => {
  const wrapper = mount(<RangeSlider />);
  expect(wrapper.state().range).toEqual([0, 100]);

  wrapper.find('RangeSlider').last().prop('onChange')([0, 10]);
  expect(wrapper.state().range).toEqual([0, 10]);

  wrapper.setProps({ max: 50 });
  expect(wrapper.state().range).toEqual([0, 10]);
});

it('should not update range if wrong default value', () => {
  const wrapper = mount(<RangeSlider />);
  expect(wrapper.state().range).toEqual([0, 100]);

  wrapper.setProps({ value: [150] });
  expect(wrapper.state().range).toEqual([0, 100]);
});

it('should not update range if wrong value', () => {
  const wrapper = mount(<RangeSlider value={[10, 20]} />);
  wrapper.instance.setState = jest.fn();
  expect(wrapper.state().range).toEqual([10, 20]);

  wrapper.setProps({ value: [10, 20] });
  expect(wrapper.instance.setState).not.toHaveBeenCalled();
});
