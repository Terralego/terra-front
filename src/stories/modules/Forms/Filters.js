import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, number, boolean } from '@storybook/addon-knobs';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_BOOL, TYPE_RANGE } from '../../../modules/Forms/Filters';

export class CustomFilters extends React.Component {
  state = {}

  onChange = properties => {
    action('Filters update', properties);
    this.setState({ properties });
  }

  render () {
    const { properties } = this.state;

    return (
      <Filters
        onChange={this.onChange}
        properties={properties || {
          single_value: text('single value initial value', ''),
          single_value_forced: select('single value with suggestions initial value', {
            développeur: 'développeur',
            'UX designer': 'UX designer',
            'Chef de projet': 'Chef de projet',
          }, ''),
          many_values: select('Many values with suggestions initial value', {
            développeur: 'développeur',
            'UX designer': 'UX designer',
            'Chef de projet': 'Chef de projet',
          }, ''),
          Range_values: [number('Range from', 0), number('Range to', 100)],
          switch_value: boolean('Bool initial value'),
        }}
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
        },
        {
          property: 'many_values_tags',
          label: 'Test',
          type: TYPE_MANY,
          display: 'select',
          values: [
            { id: 1, label: 'développeur' },
            { id: 2, label: 'UX designer' },
            { id: 3, label: 'Chef de projet' },
          ],
        },
        {
          property: 'switch_value',
          label: 'Switch label',
          type: TYPE_BOOL,
        }]}
      />
    );
  }
}

export default CustomFilters;
