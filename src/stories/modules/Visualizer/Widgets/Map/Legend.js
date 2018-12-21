import React from 'react';
import { select } from '@storybook/addon-knobs';

import Legend from '../../../../../modules/Map/InteractiveMap/components/Legend';

const items = shape => ([{
  label: 'Rouge',
  color: 'red',
  shape,
}, {
  label: 'Vert',
  color: 'green',
  shape,
}, {
  label: 'Bleu',
  color: 'blue',
  shape,
}]);

export default () => (
  <Legend
    title="Exemple de légende"
    items={items(select(
      'Shape',
      ['square', 'circle'],
      'square',
    ))}
  />
);
