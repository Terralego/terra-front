import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { DateRangeInput } from './DateRangeInput';
import MultiSelect from './MultiSelect';

jest.mock('@blueprintjs/datetime', () => ({
  DateRangeInput: () => <p>BPDateRangeInput</p>,
}));

it('should render', () => {
  const tree = renderer.create((
    <DateRangeInput
      label="My range"
      onChange={() => null}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render local error', () => {
  const wrapper = shallow((
    <DateRangeInput
      label="Change Values of my range"
      onChange={() => null}
      locales={{
        overlappingDatesMessage: 'Date chevauchante',
        invalidDateMessage: 'Date invalide',
      }}
    />
  ));
  expect(wrapper.find('DateRangeInput').props().overlappingDatesMessage).toEqual('Date chevauchante');
  expect(wrapper.find('DateRangeInput').props().invalidDateMessage).toEqual('Date invalide');
});

it('should render default error', () => {
  const wrapper = shallow((
    <DateRangeInput
      label="Change Values of my range"
      onChange={() => null}
    />
  ));
  expect(wrapper.find('DateRangeInput').props().overlappingDatesMessage).toEqual('Overlapping date');
  expect(wrapper.find('DateRangeInput').props().invalidDateMessage).toEqual('Invalid date');
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const date = new Date();
  const wrapper = shallow((
    <DateRangeInput
      label="Change Values of my range"
      onChange={onChange}
    />
  ));
  wrapper.find('DateRangeInput').props().onChange([date, date]);
  expect(onChange).toHaveBeenCalled();
});

it('shoud render formatDate', () => {
  const date = new Date();
  const wrapper = shallow(<DateRangeInput />);
  const { formatDate } = wrapper.find('DateRangeInput').props();
  wrapper.find('DateRangeInput').props();
  expect(formatDate(date)).toBe(date.toLocaleDateString());
});

it('shoud render date', () => {
  const str = (new Date()).toLocaleDateString();
  const wrapper = shallow(<DateRangeInput />);
  const { parseDate } = wrapper.find('DateRangeInput').props();
  wrapper.find('DateRangeInput').props();
  expect(parseDate(str)).toEqual(new Date(str));
});
