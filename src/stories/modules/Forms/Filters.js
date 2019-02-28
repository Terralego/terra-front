import React from 'react';

import Filters, { TYPE_SINGLE, TYPE_MANY, TYPE_RANGE } from '../../../modules/Forms/Filters';

export class CustomFilters extends React.Component {
  handleChange = properties => this.setState(state => ({ ...state, ...properties }));

  render () {
    const { handleChange } = this;
    return (
      <Filters
        onChange={handleChange}
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
        }]}
      />
    );
  }
}

export default CustomFilters;
