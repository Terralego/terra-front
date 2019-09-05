import React from 'react';
import { action } from '@storybook/addon-actions';
import { text, select, number, boolean } from '@storybook/addon-knobs';

import Filters, {
  TYPE_SINGLE,
  TYPE_MANY,
  TYPE_BOOL,
  TYPE_RANGE,
} from '../../../modules/Forms/Filters';
import './styles.css';

export class CustomFilters extends React.Component {
  state = {};

  onChange = properties => {
    action('Filters update', properties);
    this.setState({ properties });
  };

  render () {
    const { properties } = this.state;

    const dummyValues = {
      développeur: 'développeur',
      'UX designer': 'UX designer',
      'Chef de projet': 'Chef de projet',
    };

    return (
      <Filters
        onChange={this.onChange}
        properties={properties || {
          single_value: text('single value initial value', ''),
          single_value_forced: select('single value with suggestions initial value', dummyValues, ''),
          many_values: select('Many values with suggestions initial value', dummyValues, ''),
          small_range: [number('Small range from', 30), number('Small range to', 70)],
          not_controlable: [1500, 6000],
          large_range: [number('Large range from', 15460), number('Large range to', 40214)],
          switch_value: boolean('Bool initial value'),
          many_values_select_forced: select('Many values forced as select', Object.values(dummyValues)),
        }}
        filters={[{
          property: 'single_value',
          label: 'Single value filter without values',
          type: TYPE_SINGLE,
        }, {
          property: 'single_value_forced',
          label: 'Single value filter with values',
          type: TYPE_SINGLE,
          values: ['développeur', 'UX designer', 'Chef de projet'],
        }, {
          property: 'many_values',
          label: 'Many filter with values',
          type: TYPE_MANY,
          values: ['développeur', 'UX designer', 'Chef de projet'],
        }, {
          property: 'small_range',
          label: 'Small range',
          type: TYPE_RANGE,
          // Below, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
          labelStepSize: 10,
        }, {
          property: 'not_controlable',
          label: 'Large range with poor precision',
          type: TYPE_RANGE,
          max: 10000,
          // Below, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
          stepSize: 500,
          labelStepSize: 1000,
        }, {
          property: 'large_range',
          label: 'Large range',
          type: TYPE_RANGE,
          min: 0,
          max: 250000,
        }, {
          property: 'many_values_select_forced',
          label: 'Many filter with values forced as select',
          type: TYPE_MANY,
          display: 'select',
          placeholder: 'Filtres...',
          values: ['Développeur', 'UX designer', 'Chef de projet'],
        }, {
          property: 'date_range',
          label: 'Date range',
          format: 'date',
          contiguousCalendarMonths: false,
          allowSingleDayRange: true,
          type: TYPE_RANGE,
        }, {
          property: 'switch_value',
          label: 'Switch filter',
          type: TYPE_BOOL,
        }]}
      />
    );
  }
}

export default CustomFilters;
