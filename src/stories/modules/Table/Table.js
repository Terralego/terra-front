import React from 'react';

import { object } from '@storybook/addon-knobs';

import Table from '../../../modules/Table/Table';

const columns = ['foo', 'bar'];
const data = [['fghj', 'ghjk'], ['fghjkk', 'ghjkl']];

export default () => (
  <div style={{ height: '100vh' }}>
    <Table
      columns={object('Columns', columns)}
      data={object('Data', data)}
    />
  </div>
);
