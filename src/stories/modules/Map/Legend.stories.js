import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean } from '@storybook/addon-knobs';

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

const jsonAuto = {
  items: [
    {
      color: '#D03568',
      shape: 'square',
      boundaries: {
        lower: {
          value: 38.0,
          included: true,
        },
        upper: {
          value: 826.285714285714,
          included: true,
        },
      },
    },
    {
      color: '#F79465',
      shape: 'square',
      boundaries: {
        lower: {
          value: 15.7142857142857,
          included: true,
        },
        upper: {
          value: 38.0,
          included: false,
        },
      },
    },
    {
      color: '#F7C99E',
      shape: 'square',
      boundaries: {
        lower: {
          value: 6.28571428571429,
          included: true,
        },
        upper: {
          value: 15.7142857142857,
          included: false,
        },
      },
    },
    {
      color: '#EFE3CF',
      shape: 'square',
      boundaries: {
        lower: {
          value: 0.714285714285714,
          included: true,
        },
        upper: {
          value: 6.28571428571429,
          included: false,
        },
      },
    },
    {
      color: '#8CCBDA',
      shape: 'square',
      boundaries: {
        lower: {
          value: -2.85714285714286,
          included: true,
        },
        upper: {
          value: 0.714285714285714,
          included: false,
        },
      },
    },
    {
      color: '#2FB0C5',
      shape: 'square',
      boundaries: {
        lower: {
          value: -7.28571428571429,
          included: true,
        },
        upper: {
          value: -2.85714285714286,
          included: false,
        },
      },
    },
    {
      color: '#217B8B',
      shape: 'square',
      boundaries: {
        lower: {
          value: -4450.14285714286,
          included: true,
        },
        upper: {
          value: -7.28571428571429,
          included: false,
        },
      },
    },
  ],
  title: 'People migration rate',
  source: 'Source of data',
  rounding: 1,
};

const jsonAutoWithNullValue = JSON.parse(JSON.stringify(jsonAuto));
jsonAutoWithNullValue.items.push({
  color: '#222222',
  shape: 'square',
  boundaries: {
    lower: {
      value: null,
      included: false,
    },
    upper: {
      value: null,
      included: false,
    },
  },
});

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

stories.add(
  'Auto generated json',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend
          {...(boolean('Null value ?', false)
            ? jsonAutoWithNullValue
            : jsonAuto)}
          rounding={boolean('Rounding', true) ? jsonAuto.rounding : undefined}
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
        stackedCircles
        items={[
          {
            label: 'exercitation ullamco',
            color: 'white',
            shape: 'circle',
            diameter: 60,
          },
          {
            label: 'laboris nisi ut aliquip',
            color: 'white',
            shape: 'circle',
            diameter: 20,
          },
          {
            label: 'ex ea commodo consequat',
            color: 'white',
            shape: 'circle',
            diameter: 10,
          },
        ]}
      />
    </div>
  </div>
));
