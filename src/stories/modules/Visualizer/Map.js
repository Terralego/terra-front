import React from 'react';

import { select, number, array, object } from '@storybook/addon-knobs';

import Map from '../../../modules/Map/Map';

export default () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <Map
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle={select(
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
  </div>
);
