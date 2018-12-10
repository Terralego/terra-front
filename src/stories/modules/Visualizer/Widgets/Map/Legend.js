import React from 'react';

import Legend from '../../../../../modules/Visualizer/widgets/Map/components/Legend';

const items = [{
  label: 'Rouge',
  color: 'red',
}, {
  label: 'Vert',
  color: 'green',
}, {
  label: 'Bleu',
  color: 'blue',
}];

export default () => <Legend title="Exemple de légende" items={items} />;
