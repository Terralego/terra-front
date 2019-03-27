import React from 'react';

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
];
const data = [
  ['fghj', 'ghjk', '123'],
  ['fghjkk', 'ghjkl', '23.78'],
  ['abc', 'def', '1'],
  ['fghr', 'bnz', '12'],
  ['lorem', 'ipsum', '12345.67890'],
];

export default () => (
  <div style={{ height: '100vh' }}>
    <Table
      columns={object('Columns', columns)}
      data={object('Data', data)}
      loading={boolean('Loading ?', false)}
      onSelection={value => action('selectedRows')(value.join(','))}
    />
  </div>
);
