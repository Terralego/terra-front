import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, number, boolean } from '@storybook/addon-knobs';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_BOOL, TYPE_RANGE } from '../../../modules/Forms/Filters';

export class CustomFilters extends React.Component {
  state = {};

  onChange = properties => {
    action('Filters update', properties);
    this.setState({ properties });
  };

  render () {
    const { properties } = this.state;

    const locales = {
      noResults: 'Aucun résultat',
      overlappingDatesMessage: 'Date chevauchante',
      invalidDateMessage: 'Date invalide',
    };

    return (
      <Filters
        locales={locales}
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
          many_values_select_forced: select('Many values forced as select', ['développeur', 'UX designer', 'Chef de projet']),
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
          max: 10000,
          stepSize: 100,
          labelStepSize: 1000,
        }, {
          property: 'many_values_select_forced',
          label: 'Test',
          type: TYPE_MANY,
          display: 'select',
          placeholder: 'Filtres...',
          values: ['Développeur', 'UX designer', 'Chef de projet'],
        }, {
          property: 'date_range',
          label: 'Test',
          format: 'date',
          contiguousCalendarMonths: false,
          allowSingleDayRange: true,
          startInputProps: {
            placeholder: 'Du JJ/MM/AAAA',
            className: 'range-start',
          },
          endInputProps: {
            placeholder: 'Au JJ/MM/AAAA',
            className: 'range-end',
          },
          type: TYPE_RANGE,
        }, {
          property: 'switch_value',
          label: 'Switch label',
          type: TYPE_BOOL,
        }]}
      />
    );
  }
}

export default CustomFilters;
