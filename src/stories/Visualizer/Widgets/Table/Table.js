import React from 'react';

import WidgetTable from '../../../../modules/Visualizer/widgets/Table';

import data from './data.json';

export default () => (
  <WidgetTable
    data={data}
    columns={[
      {
        label: 'Nom',
        sortable: true,
        editable: true,
      },
      {
        label: 'Date',
        sortable: true,
        editable: true,
        format: { type: 'date', value: 'DD/MM/YYYY' },
      },
      'Lorem',
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
