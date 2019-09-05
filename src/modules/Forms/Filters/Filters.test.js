import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Select from '../Controls/Select';
import Text from '../Controls/Text';
import Checkboxes from '../Controls/Checkboxes';
import Range from '../Controls/Range';
import Switch from '../Controls/Switch';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE, TYPE_BOOL, getComponent } from './Filters';
import DateRangeInput from '../Controls/DateRangeInput';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
  InputGroup: () => <p>Input</p>,
  Select: ({ children }) => children,
  Switch: () => <p>Switch</p>,
  MenuItem: ({ text = 'Menu Item' }) => <p>{text}</p>,
  Button: () => <p>Button</p>,
  RangeSlider: () => <p>Range</p>,
}));

jest.mock('../Controls/Text', () => () => <p>ControlText</p>);
jest.mock('../Controls/MultiSelect', () => () => <p>ControlMultiSelect</p>);
jest.mock('../Controls/Select', () => ({ initialContent }) => (
  <p>
    {initialContent ? (
      <>
        ControlSelect with initialContent set to
        {initialContent}
      </>
    ) : 'ControlSelect'}
  </p>
));
jest.mock('../Controls/Checkboxes', () => () => <p>ControlCheckboxes</p>);
jest.mock('../Controls/Range', () => () => <p>ControlRange</p>);
jest.mock('../Controls/DateRangeInput', () => () => <p>DateRangeInput</p>);

it('should build a form', () => {
  const tree = renderer.create((
    <Filters
      onChange={() => null}
      filters={[{
        property: 'single_value',
        label: 'Vocations',
        type: TYPE_SINGLE,
      }, {
        property: 'single_value_forced',
        label: 'Vocations',
        type: TYPE_SINGLE,
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'shitload_of_values',
        label: 'Shitload',
        type: TYPE_SINGLE,
        display: 'select',
        values: Array(251),
      }, {
        property: 'many_values',
        label: 'Foo',
        type: TYPE_MANY,
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'many_values_select_forced',
        label: 'Foo',
        type: TYPE_MANY,
        display: 'select',
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'range_values',
        label: 'Percentage of bar',
        type: TYPE_RANGE,
        values: [40, 60],
        min: 0,
        max: 100,
      }, {
        property: 'one_value',
        label: 'Booléen',
        type: TYPE_BOOL,
        value: true,
      }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const onChange = jest.fn();
  const wrapper = shallow((
    <Filters
      onChange={onChange}
      filters={[{
        property: 'single_value',
        label: 'Vocations',
        type: TYPE_SINGLE,
      }, {
        property: 'single_value_forced',
        label: 'Vocations',
        type: TYPE_SINGLE,
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'many_values',
        label: 'Foo',
        type: TYPE_MANY,
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'range_values',
        label: 'Percentage of bar',
        type: TYPE_RANGE,
        values: [40, 60],
        min: 0,
        max: 100,
      }, {
        property: 'switch_value',
        label: 'Switch label',
        type: TYPE_BOOL,
      }]}
    />
  ));

  wrapper.instance().onChange('pwout')('pwet');
  expect(onChange).toHaveBeenCalledWith({ pwout: 'pwet' });
});

it('should get component', () => {
  expect(getComponent(TYPE_SINGLE, 'text') === Text).toBe(true);
  expect(getComponent(TYPE_SINGLE, ['text', 'text2']) === Select).toBe(true);
  expect(getComponent(TYPE_MANY, ['text', 'text2']) === Checkboxes).toBe(true);
  expect(getComponent(TYPE_BOOL, true) === Switch).toBe(true);
  expect(getComponent(TYPE_RANGE, [10, 90]) === Range).toBe(true);
  expect(getComponent(TYPE_RANGE, [null, null], null, 'date') === DateRangeInput).toBe(true);
  expect(getComponent('NONE_EXISTING_TYPE', 'text') === null).toBe(true);
});

it('should ensure translation works', () => {
  const translate = jest.fn();
  const wrapper = shallow((
    <Filters
      translate={translate}
      filters={[{
        property: 'switch_value',
        label: 'Switch label',
        type: TYPE_BOOL,
      }]}
    />
  ));
  expect(wrapper.find('Control').props().translate).toEqual(translate);
});
