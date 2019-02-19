import React from 'react';
import renderer from 'react-test-renderer';

import Filters from './Filters';

it('should build a form', () => {
  const tree = renderer.create((
    <Filters
      onChange={properties => console.log(properties)}
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
      }/*, {
        property: 'employments',
        label: 'Emplois',
        type: 'range',
      }*/]}
    />
  )).toJSON();
  expect(tree).toMatchSnapshot();
});
