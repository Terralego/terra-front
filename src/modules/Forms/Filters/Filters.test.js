import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE } from './Filters';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
  InputGroup: () => <p>Input</p>,
  Select: ({ children }) => children,
  MenuItem: () => <p>Menu Item</p>,
  Button: () => <p>Button</p>,
  RangeSlider: () => <p>Range</p>,
}));

it('should build a form', () => {
  const tree = renderer.create((
    <Filters
      locales={{ noResults: 'Aucun résultats' }}
      onChange={() => null}
      properties={[{
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
      }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should mount & update correctly', () => {
  const wrapper = shallow((
    <Filters
      onChange={() => null}
      properties={[{
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
        property: 'fake',
        label: 'fake',
        type: TYPE_RANGE,
      }]}
    />
  ));

  wrapper.instance().onChange('pwout')('pwet');
  expect(wrapper.instance().state.properties.pwout).toEqual('pwet');
});
