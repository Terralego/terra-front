import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, object } from '@storybook/addon-knobs';
import { action }  from '@storybook/addon-actions';

import Table from '../../../modules/Table/Table';

const columns = [
  'foo',
  'bar',
  {
    label: '845',
    value: '845',
    format: { type: 'number' },
    sortable: true,
  },
  {
    label: 'Color',
    value: 'Color',
    format: { type: 'string' },
    sortable: true,
    customSortColumn (a, b) {
      const value = str => str.split('').reverse().splice(2, 1);
      return `${value(b)}`.localeCompare(value(a));
    },
  },
];
const data = [
  ['fghj', 'ghjk', '123', 'magenta'],
  ['fghjkk', 'ghjkl', '23.78', 'cyan'],
  ['abc', 'def', '1', 'yellow'],
  ['fghr', 'bnz', '12', 'black'],
  ['lorem', 'ipsum', '12345.67890', 'yellow'],
];

storiesOf('Components/Table', module)
  .add('Table', () => (
    <div style={{ height: '100vh' }}>
      <Table
        columns={object('Columns', columns)}
        data={object('Data', data)}
        loading={boolean('Loading?', false)}
        onSelection={value => action('selectedRows')(value.join(','))}
        renderCell={({ children, originalRowIndex, columnIndex }) => (boolean('Display cell coordinates?', false) ? <>[{originalRowIndex},{columnIndex}]: {children}</> : children)}
        onSort={action('sort column')}
      />
    </div>
  ));
