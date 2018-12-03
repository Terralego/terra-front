import React from 'react';
import { text } from '@storybook/addon-knobs';

import Header from '../../../../../modules/Visualizer/widgets/Table/components/Header';

export default () => (
  <Header
    title={text('Title', 'Title of the table')}
    columns={[
      {
        value: 'Name',
        sortable: true,
        editable: true,
        display: true,
      },
      {
        value: 'Dates',
        sortable: true,
        editable: true,
        format: { type: 'date' },
        display: false,
      },
      {
        value: 'Numbers',
        sortable: true,
        editable: true,
        display: true,
        format: { type: 'number' },
      },
    ]}
  />
);
