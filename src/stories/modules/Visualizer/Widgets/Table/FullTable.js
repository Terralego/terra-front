import React from 'react';

import WidgetTable from '../../../../../modules/Visualizer/widgets/Table';

import data from './data.json';

export default () => (
  <WidgetTable
    title="Example title"
    data={data}
    columns={[
      {
        value: 'Nom',
        sortable: true,
        editable: true,
      },
      {
        value: 'Dates',
        sortable: true,
        editable: true,
        format: { type: 'date' },
      },
      {
        value: 'Numbers',
        sortable: true,
        editable: true,
        format: { type: 'number' },
      },
      'Ipsum',
      'Dolor',
      'Sit',
      'Amet',
      'Consectetur',
      'Adipiscing',
      'Elit',
      'Sed',
      'Non',
      'Risus',
    ]}
  />
);
