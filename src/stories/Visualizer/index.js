import React from 'react';
import { storiesOf } from '@storybook/react';
import { select, number, array, object } from '@storybook/addon-knobs';

import Visualizer from '../../modules/Visualizer';

const stories = storiesOf('Visualizer', module);

stories.add('Visualizer', () => (
  <div style={{ width: '100vh', height: '100vh' }}>
    <Visualizer
      mapStyle={select(
        'mapStyle',
        [
          'mapbox://styles/mapbox/light-v9',
          'mapbox://styles/mapbox/dark-v9',
          'mapbox://styles/mapbox/basic-v9',
          'mapbox://styles/mapbox/satellite-v9',
        ],
        'mapbox://styles/mapbox/light-v9',
       )}
      scaleControl={select(
        'scaleControl',
        [true, false],
        true,
      )}
      navigationControl={select(
        'navigationControl',
        [true, false],
        true,
      )}
      attributionControl={select(
        'attributionControl',
        [true, false],
        true,
      )}
      maxZoom={number('maxZoom', 18)}
      minZoom={number('minZoom', 0)}
      maxBounds={array('maxBounds', [
        [-74.04728500751165, 40.68392799015035], // Southwest coordinates
        [-73.91058699000139, 40.87764500765852], // Northeast coordinates
      ])}
      flyTo={object('flyTo', { center: [0, 0], zoom: 9 })}
      zoom="5" // set default zoom
    />
  </div>
));
