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
import translateMock from '../../../utils/translate';

const dummyValues = {
  developpeur: 'développeur',
  'UX designer': 'UX designer',
  'Chef de projet': 'Chef de projet',
};

const dummyMonth = {
  January: 'January',
  February: 'February',
  March: 'March',
  April: 'April',
  May: 'May',
  June: 'June',
  July: 'July',
  August: 'August',
  September: 'September',
  October: 'October',
  November: 'November',
  December: 'December',
};

const translateMockWithDefaultValue = translateMock({
  'terralego.forms.controls.select.empty_item': 'All',
  'terralego.forms.controls.select.no_results': 'No results.',
  'terralego.forms.controls.select.select_placeholder': 'Enter a query first',
  'terralego.forms.controls.select.input_placeholder': 'Filter...',
  'terralego.forms.controls.multiselect.no_results': 'No results.',
  'terralego.forms.controls.multiselect.select_placeholder': 'Enter a query first',
  'terralego.forms.controls.multiselect.input_placeholder': 'Filter...',
  'terralego.forms.controls.generic.empty_item': 'Nothing',
});

const onChange = properties => {
  action('Filters update', properties);
};

storiesOf('Components/Filters', module).add('Single', () => (
  <Filters
    translate={translateMockWithDefaultValue}
    onChange={onChange}
    properties={{
      single_value: text('single value initial value', ''),
      single_value_forced: select('single value with suggestions initial value', dummyValues, ''),
      single_value_forced_with_values: select('single value with suggestions initial value and filters', dummyMonth, ''),
    }}
    filters={[{
      property: 'single_value',
      label: 'Single value filter without values',
      type: TYPE_SINGLE,
    }, {
      property: 'single_value_forced',
      label: 'Single value with values',
      type: TYPE_SINGLE,
      values: ['développeur', 'UX designer', 'Chef de projet'],
    }, {
      property: 'single_value_forced_with_values',
      label: 'Single value filter with values',
      type: TYPE_SINGLE,
      values: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    }]}
  />
));

storiesOf('Components/Filters', module).add('Many', () => (
  <Filters
    onChange={onChange}
    translate={translateMockWithDefaultValue}
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
      values: ['Développeur', 'UX designer', 'Chef de projet'],
    }]}
  />
));

storiesOf('Components/Filters', module).add('Range', () => (
  <Filters
    onChange={onChange}
    properties={{
      small_range: [
        number('From (small range)', 30, {}, 'Small range'),
        number('To (small range)', 70, {}, 'Small range'),
      ],
      not_controlable: [1500, 6000],
      large_range: [
        number('From (large range)', 15460, {}, 'Large range'),
        number('To (large range)', 40214, {}, 'Large range'),
      ],
    }}
    filters={[{
      property: 'small_range',
      label: 'Small range',
      type: TYPE_RANGE,
      // Below, props accepted by https://blueprintjs.com/docs/#core/components/sliders.range-slider
      labelStepSize: 10,
      min: number('Min (small range)', 0, {}, 'Small range'),
      max: number('Max (small range)', 100, {}, 'Small range'),
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
      min: number('Min (large range)', 0, {}, 'Large range'),
      max: number('Max (large range)', 100000, {}, 'Large range'),
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
