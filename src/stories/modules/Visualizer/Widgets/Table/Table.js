import React from 'react';

import Table from '../../../../../modules/Visualizer/widgets/Table/components/Table';

import data from './data.json';

export default () => (
  <Table
    data={data}
    columns={[
      {
        value: 'Name',
        sortable: true,
        editable: true,
      },
      {
        value: 'Date',
        sortable: true,
        editable: true,
        format: { type: 'date', value: 'DD/MM/YYYY' },
      },
      {
        value: 'Lorem',
        sortable: true,
      },
      {
        value: 'Ipsum',
        sortable: true,
      },
      {
        value: 'Dolor',
        sortable: true,
      },
      {
        value: 'Sit',
        sortable: true,
      },
      {
        value: 'Amet',
        sortable: true,
      },
      {
        value: 'Consectetur',
        sortable: true,
      },
      {
        value: 'Adipiscing',
        sortable: true,
      },
      {
        value: 'Elit',
        sortable: true,
      },
      {
        value: 'Sed',
        sortable: true,
      },
      {
        value: 'Non',
        sortable: true,
      },
      {
        value: 'Risus',
        sortable: true,
      },
    ]}
  />
);
