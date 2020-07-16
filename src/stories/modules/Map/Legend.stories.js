import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

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
    source: 'Source of level 2',
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

stories.add(
  'JSON items',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend title="foo" items={json} source="Source of foo" />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Nunjucks template',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend title="bar" content={text('Nunjucks template', template)} />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Both',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend
          title="baz"
          items={json}
          content={text('Nunjucks template', template)}
        />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add('Circles', () => (
  <div className="interactive-map">
    <div className="interactive-map__legends">
      <Legend
        title="foo"
        source="Source of wrapper"
        stackedCircles={boolean('Stack circles', false)}
        items={[
          {
            label: 'exercitation ullamco',
            color: 'white',
            shape: 'circle',
            diameter: 30,
          },
          {
            label: 'laboris nisi ut aliquip',
            color: 'white',
            shape: 'circle',
            diameter: 15,
          },
          {
            label: 'ex ea commodo consequat',
            color: 'white',
            shape: 'circle',
            diameter: 5,
          },
        ]}
      />
    </div>
  </div>
));

stories.add('Stacked', () => (
  <div className="interactive-map">
    <div className="interactive-map__legends">
      <Legend
        title="foo"
        items={[
          {
            label: 'quis nostrud',
            stackedCircles: true,
            items: [
              {
                label: 'exercitation ullamco',
                color: 'white',
                shape: 'circle',
                diameter: 20,
              },
              {
                label: 'laboris nisi ut aliquip',
                color: 'white',
                shape: 'circle',
                diameter: 15,
              },
              {
                label: 'ex ea commodo consequat',
                color: 'white',
                shape: 'circle',
                diameter: 10,
              },
            ],
          },
        ]}
      />
      <Legend
        title="with template"
        content={`
### Some squares

<square color="red" /> lorem ipsum<br />
<square color="green" size="16" /> dolor sit amet<br />
<square color="yellow" size="20" /> consectetur adipiscing elit<br />

### Some circles

<circle color="red" /> lorem ipsum<br />
<circle color="green" size="16" /> dolor sit amet<br />
<circle color="yellow" size="20" /> consectetur adipiscing elit<br />

<a href="the/link">lienB</a>
`}
        history={{
          push: action('push to'),
        }}
      />
    </div>
  </div>
));
