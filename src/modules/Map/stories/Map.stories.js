import React from 'react';
import { storiesOf } from '@storybook/react';

import { select, number, array, object, boolean } from '@storybook/addon-knobs';

import Map, {
  CONTROLS_TOP_RIGHT, CONTROLS_BOTTOM_LEFT, CONTROLS_BOTTOM_RIGHT,
  CONTROL_NAVIGATION, CONTROL_SCALE, CONTROL_ATTRIBUTION,
} from '../Map';
import leftInfoButtonStyles from '../../../stories/leftInfosButtonStyles';
import doc from './Map.md';

Map.displayName = 'Map';

const accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

storiesOf('Map components/Map', module).add('Map component', () => (
  <div
    style={{ width: '100vw', height: '100vh' }}
  >
    <Map
      accessToken={accessToken}
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
      controls={[boolean('Display attribution', true) && {
        control: CONTROL_ATTRIBUTION,
        position: CONTROLS_BOTTOM_RIGHT,
      }, boolean('Display navigation', true) && {
        control: CONTROL_NAVIGATION,
        position: CONTROLS_TOP_RIGHT,
      }, boolean('Display scale', true) && {
        control: CONTROL_SCALE,
        position: CONTROLS_BOTTOM_LEFT,
      }].filter(a => a)}
      maxZoom={number('maxZoom', 20)}
      minZoom={number('minZoom', 0)}
      maxBounds={array('maxBounds', [
        [-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327], // France coordinates
      ])} // Should be tried with https://boundingbox.klokantech.com/
      flyTo={object('flyTo', {})}
      zoom={5} // set default zoom
    />
  </div>
), {
  info: {
    text: doc,
    styles: leftInfoButtonStyles,
  },
});
