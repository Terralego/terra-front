import React from 'react';
import { text } from '@storybook/addon-knobs';

import Header from '../../../../../modules/Visualizer/widgets/Table/components/Header';

export default () => (
  <Header
    title={text('Title', 'Title of the table')}
    columns={[
      {
        label: 'Name',
        sortable: true,
        editable: true,
        display: true,
      },
      {
        label: 'Date',
        sortable: true,
        editable: true,
        format: { type: 'date', value: 'DD/MM/YYYY' },
        display: false,
      },
      {
        label: 'Lorem',
        sortable: true,
        editable: true,
        display: true,
      },
    ]}
  />
);
