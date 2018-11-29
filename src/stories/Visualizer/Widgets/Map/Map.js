import React from 'react';
import { select, number, array, object } from '@storybook/addon-knobs';

import Map from '../../../../modules/Visualizer/widgets/Map/components/Map';

export default () => (
  <Map
    accessToken="pk.eyJ1IjoidGFzdGF0aGFtMSIsImEiOiJjamZ1ejY2bmYxNHZnMnhxbjEydW9sM29hIn0.w9ndNH49d91aeyvxSjKQqg"
    styles={select(
      'mapStyle',
      [
        'mapbox://styles/mapbox/light-v9',
        'mapbox://styles/mapbox/dark-v9',
        'mapbox://styles/mapbox/basic-v9',
        'mapbox://styles/mapbox/satellite-v9',
      ],
      'mapbox://styles/mapbox/light-v9',
    )}
    displayScaleControl={select(
      'displayScaleControl',
      [true, false],
      true,
    )}
    displayNavigationControl={select(
      'displayNavigationControl',
      [true, false],
      true,
    )}
    displayAttributionControl={select(
      'displayAttributionControl',
      [true, false],
      true,
    )}
    maxZoom={number('maxZoom', 20)}
    minZoom={number('minZoom', 0)}
    maxBounds={array('maxBounds', [
      [-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327], // France coordinates
    ])} // Should be tried with https://boundingbox.klokantech.com/
    flyTo={object('flyTo', {})}
    zoom={5} // set default zoom
  />
);
