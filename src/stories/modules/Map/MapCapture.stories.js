import React from 'react';
import { storiesOf } from '@storybook/react';

import { boolean } from '@storybook/addon-knobs';

import Map, { CONTROLS_TOP_RIGHT, CONTROL_CAPTURE, CONTROL_NAVIGATION } from '../../../modules/Map/Map';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';

Map.displayName = 'Map';

function t (key) {
  switch (key) {
    case 'terralego.map.capture_control.button_label':
      return 'capture';
    default:
      return key;
  }
}

storiesOf('Modules/Map/', module).add('Capture in Map', () => (
  <div
    style={{ width: '100vw', height: '100vh' }}
  >
    <Map
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle="mapbox://styles/mapbox/light-v9"
      maxZoom={20}
      minZoom={0}
      maxBounds={[[-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327]]} // Should be tried with https://boundingbox.klokantech.com/
      zoom={10} // set default zoom
      controls={[{
        control: CONTROL_NAVIGATION,
        position: CONTROLS_TOP_RIGHT,
      }, boolean('Display capture', true) && {
        control: CONTROL_CAPTURE,
        position: CONTROLS_TOP_RIGHT,
      }].filter(a => a)}
      translate={t}
    />
  </div>
), {
  info: {
    styles: leftInfoButtonStyles,
  },
});
