import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import Legend from '../../../modules/Map/InteractiveMap/components/Legend';

const legend1 = {
  title: 'Foo',
  comment: 'Source of foo',
  shape: 'square',
  items: [
    {
      label: 'label 1',
      color: 'red',
    },
    {
      label: 'long label 2',
      color: 'blue',
      size: 20,
      strokeColor: '#CCCCCC',
    },
    {
      label: 'short',
      color: 'green',
      size: 25,
      strokeColor: '#ff00CC',
    },
  ],
};

const legend2 = {
  title: 'Bar',
  comment: 'Source of foo',
  shape: 'circle',
  items: [
    {
      label: 'label 1',
      color: 'red',
    },
    {
      label: 'long label 2',
      color: 'blue',
      size: 20,
      strokeColor: '#CCCCCC',
    },
    {
      label: 'short',
      color: 'green',
      size: 25,
      strokeColor: '#ffCCCC',
    },
  ],
};

const legend3 = {
  title: 'Baz',
  comment: 'Source of foo',
  shape: 'line',
  items: [
    {
      label: 'label 1',
      color: 'red',
    },
    {
      label: 'long label 2',
      color: 'blue',
      size: 20,
      strokeWidth: 4,
    },
    {
      label: 'short',
      color: 'green',
      size: 25,
      strokeWidth: 8,
    },
  ],
};


const legend4 = {
  title: 'Toto',
  comment: 'Source of toto',
  shape: 'stackedCircle',
  items: [
    {
      label: 'exercitation ullamco',
      color: 'black',
      shape: 'circle',
      diameter: 60,
    },
    {
      label: 'laboris nisi ut aliquip',
      color: 'black',
      shape: 'circle',
      diameter: 20,
    },
    {
      label: 'ex ea commodo consequat',
      color: 'black',
      shape: 'circle',
      diameter: 10,
    },
  ],
};

const legend5 = {
  title: 'Toto',
  comment: 'Source of toto',
  shape: 'stackedCircle',
  items: [
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
  ],
};

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
  shape: 'square',
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

const stories = storiesOf('Components/Legend', module);

const knobsOptions = {
  knobs: {
    timestamps: true, // Doesn't emit events while user is typing.
    escapeHTML: false,
  },
};

stories.add(
  'Square items',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend {...legend1} />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Circle items',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend {...legend2} />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Line items',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend {...legend3} />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Stacked circles',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend {...legend4} />
        <Legend {...legend5} />
      </div>
    </div>
  ),
  knobsOptions,
);

stories.add(
  'Multiple legends',
  () => (
    <div className="interactive-map">
      <div className="interactive-map__legends">
        <Legend {...legend1} title="Foo" />
        <Legend {...legend2} title="Foo" />
        <Legend {...legend3} title="Foo" />
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
