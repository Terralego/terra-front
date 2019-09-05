import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  text,
  select,
  number,
  boolean,
  optionsKnob,
} from '@storybook/addon-knobs';

import Filters, {
  TYPE_SINGLE,
  TYPE_MANY,
  TYPE_RANGE,
  TYPE_BOOL,
} from '../../../modules/Forms/Filters';
import './styles.css';

const dummyValues = {
  développeur: 'développeur',
  'UX designer': 'UX designer',
  'Chef de projet': 'Chef de projet',
};


const onChange = properties => {
  action('Filters update', properties);
};

storiesOf('Components/Filters', module).add('Single', () => (
  <Filters
    onChange={onChange}
    properties={{
      single_value: text('single value initial value', ''),
      single_value_forced: select('single value with suggestions initial value', dummyValues, ''),
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
    }]}
  />
));

storiesOf('Components/Filters', module).add('Many', () => (
  <Filters
    onChange={onChange}
    properties={{
      many_values: optionsKnob(
        'Many values with checkboxes',
        dummyValues,
        [],
        { display: 'multi-select' },
      ),
      many_values_select_forced: optionsKnob(
        'Many values forced as select',
        dummyValues,
        [],
        { display: 'multi-select' },
      ),
    }}
    filters={[{
      property: 'many_values',
      label: 'Many filter with values',
      type: TYPE_MANY,
      values: ['développeur', 'UX designer', 'Chef de projet'],
    }, {
      property: 'many_values_select_forced',
      label: 'Many filter with values forced as select',
      type: TYPE_MANY,
      display: 'select',
      placeholder: 'Filtres...',
      values: ['Développeur', 'UX designer', 'Chef de projet'],
    }]}
  />
));

storiesOf('Components/Filters', module).add('Range', () => (
  <Filters
    onChange={onChange}
    properties={{
      small_range: [number('Small range from', 30), number('Small range to', 70)],
      not_controlable: [1500, 6000],
      large_range: [number('Large range from', 15460), number('Large range to', 40214)],
    }}
    filters={[{
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
      property: 'date_range',
      label: 'Date range',
      format: 'date',
      contiguousCalendarMonths: false,
      allowSingleDayRange: true,
      type: TYPE_RANGE,
    }]}
  />
));

storiesOf('Components/Filters', module).add('Boolean', () => (
  <Filters
    onChange={onChange}
    properties={{
      switch_value: boolean('Bool initial value'),
    }}
    filters={[{
      property: 'switch_value',
      label: 'Switch filter',
      type: TYPE_BOOL,
    }]}
  />
));
