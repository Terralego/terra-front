import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Filters from './Filters';

jest.mock('@blueprintjs/core', () => ({
  Checkbox: () => <p>Checkbox</p>,
  InputGroup: () => <p>Input</p>,
  Select: ({ children }) => children,
  MenuItem: () => <p>Menu Item</p>,
  Button: () => <p>Button</p>,
}));

it('should build a form', () => {
  const tree = renderer.create((
    <Filters
      onChange={() => null}
      properties={[{
        property: 'single_value',
        label: 'Vocations',
        type: 'single',
      }, {
        property: 'single_value_forced',
        label: 'Vocations',
        type: 'single',
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'many_values',
        label: 'Foo',
        type: 'many',
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'fake',
        label: 'fake',
        type: 'range',
      }]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have default onChange', () => {
  expect(Filters.defaultProps.onChange).toBeDefined();
});

it('should default props make something', () => {
  expect(Filters.defaultProps.onChange('ah')).toBe(null);
});

it('should mount & update correctly', () => {
  const wrapper = shallow((
    <Filters
      onChange={() => null}
      properties={[{
        property: 'single_value',
        label: 'Vocations',
        type: 'single',
      }, {
        property: 'single_value_forced',
        label: 'Vocations',
        type: 'single',
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'many_values',
        label: 'Foo',
        type: 'many',
        values: ['développeur', 'UX designer', 'Chef de projet'],
      }, {
        property: 'fake',
        label: 'fake',
        type: 'range',
      }]}
    />
  ));

  wrapper.instance().onChange('pwout')('pwet');
  expect(wrapper.instance().state.pwout).toEqual('pwet');
});
