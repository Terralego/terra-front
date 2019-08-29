import React from 'react';
import { storiesOf } from '@storybook/react';
import { text } from '@storybook/addon-knobs';

import Legend from '../../../modules/Map/InteractiveMap/components/Legend';

const json = [
  {
    label: 'level1.1',
    color: 'red',
  },
  {
    label: 'level1.2',
    color: 'blue',
  },
  {
    label: 'level2',
    items: [
      {
        label: 'level2.1',
        color: 'red',
      },
      {
        label: 'level2.2',
        color: 'blue',
      },
      {
        label: 'level3',
        items: [
          {
            label: 'level3.1',
            color: 'red',
          },
          {
            label: 'level3.2',
            color: 'blue',
          },
          {
            template: '<strong>custom text</strong> at end of level 3',
          },
          {
            label: 'level4',
            items: [
              {
                label: 'level4.1',
                color: 'red',
              },
              {
                label: 'level4.2',
                color: 'blue',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    template: `
### Custom Nunjucks template
<em>after last legend item</em>
    `,
  },
];

const template = `# Hello World

<square color="red" /> foo<br />
<square color="green" /> bar<br />

<circle color="red" /> foo<br />
<circle color="green" /> bar<br />
`;

const stories = storiesOf('Components/Legend', module);

const knobsOptions = {
  knobs: {
    timestamps: true, // Doesn't emit events while user is typing.
    escapeHTML: false,
  },
};

stories.add('JSON items', () => (
  <div style={{ width: 300, margin: '0 auto' }}>
    <Legend
      title="foo"
      items={json}
    />
  </div>
), knobsOptions);

stories.add('Nunjucks template', () => (
  <div style={{ width: 300, margin: '0 auto' }}>
    <Legend
      title="bar"
      content={text('Nunjucks template', template)}
    />
  </div>
), knobsOptions);

stories.add('Both', () => (
  <div style={{ width: 300, margin: '0 auto' }}>
    <Legend
      title="baz"
      items={json}
      content={text('Nunjucks template', template)}
    />
  </div>
), knobsOptions);
