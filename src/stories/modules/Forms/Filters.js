import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, number, boolean } from '@storybook/addon-knobs';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_BOOL, TYPE_RANGE } from '../../../modules/Forms/Filters';

export const CustomFilters = () => (
  <Filters
    onChange={action('Filters update')}
    properties={[{
      property: 'single_value',
      label: 'Vocations',
      type: TYPE_SINGLE,
      value: text('single value initial value', ''),
    }, {
      property: 'single_value_forced',
      label: 'Vocations',
      type: TYPE_SINGLE,
      values: ['développeur', 'UX designer', 'Chef de projet', 'foo', 'bar', 'foobar', 'barfoo', 'test', 'test2', 'coin'],
      value: select('single value with suggestions initial value', {
        développeur: 'développeur',
        'UX designer': 'UX designer',
        'Chef de projet': 'Chef de projet',
      }, ''),
    }, {
      property: 'many_values',
      label: 'Foo',
      type: TYPE_MANY,
      values: ['développeur', 'UX designer', 'Chef de projet'],
      value: select('Many values with suggestions initial value', {
        développeur: 'développeur',
        'UX designer': 'UX designer',
        'Chef de projet': 'Chef de projet',
      }, ''),
    },
    {
      property: 'Range_values',
      label: 'Pourcentage de Bar',
      type: TYPE_RANGE,
      values: [10, 40],
      // Belows, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
      min: 0,
      max: 100,
      stepSize: 2,
      labelStepSize: 20,
      value: [number('Range from', 0), number('Range to', 100)],
    }, {
      property: 'switch_value',
      label: 'Switch label',
      type: TYPE_BOOL,
      value: boolean('Bool initial value'),
    }]}
  />
);

export default CustomFilters;
