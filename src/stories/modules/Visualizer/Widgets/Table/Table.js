import React from 'react';

import Table from '../../../../../modules/Visualizer/widgets/Table/components/Table';

import data from './data.json';

export default () => (
  <Table
    data={data}
    columns={[
      {
        label: 'Name',
        sortable: true,
        editable: true,
      },
      {
        label: 'Date',
        sortable: true,
        editable: true,
        format: { type: 'date', value: 'DD/MM/YYYY' },
      },
      {
        label: 'Lorem',
        sortable: true,
      },
      {
        label: 'Ipsum',
        sortable: true,
      },
      {
        label: 'Dolor',
        sortable: true,
      },
      {
        label: 'Sit',
        sortable: true,
      },
      {
        label: 'Amet',
        sortable: true,
      },
      {
        label: 'Consectetur',
        sortable: true,
      },
      {
        label: 'Adipiscing',
        sortable: true,
      },
      {
        label: 'Elit',
        sortable: true,
      },
      {
        label: 'Sed',
        sortable: true,
      },
      {
        label: 'Non',
        sortable: true,
      },
      {
        label: 'Risus',
        sortable: true,
      },
    ]}
  />
);
