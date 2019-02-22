import React from 'react';

import Filters, { TYPE_SINGLE, TYPE_MANY } from '../../../modules/Forms/Filters';

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
        }]}
      />
    );
  }
}

export default CustomFilters;
