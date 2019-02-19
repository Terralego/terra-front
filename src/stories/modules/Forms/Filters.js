import React from 'react';

import Filters from '../../../modules/Forms/Filters';

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
    );
  }
}

export default CustomFilters;
