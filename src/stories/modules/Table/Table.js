import React from 'react';

import { boolean, object } from '@storybook/addon-knobs';
import { action }  from '@storybook/addon-actions';

import Table from '../../../modules/Table/Table';

const columns = ['foo', 'bar'];
const data = [['fghj', 'ghjk'], ['fghjkk', 'ghjkl']];

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