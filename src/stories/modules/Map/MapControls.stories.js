import React from 'react';
import { storiesOf } from '@storybook/react';

import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import Map, { CONTROLS_TOP_RIGHT, CONTROLS_TOP_LEFT, CONTROL_DRAW, CONTROL_CAPTURE, CONTROL_NAVIGATION } from '../../../modules/Map/Map';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';

import doc from './MapControls.md';

Map.displayName = 'Map';

const t = key => {
  switch (key) {
    case 'terralego.map.capture_control.button_label':
      return 'capture';
    default:
      return key;
  }
};

const onChange = event => {
  const title = 'Trigger action:';
  // eslint-disable-next-line no-console
  console.log(event);
  action(title)(event.type);
};

storiesOf('Modules/Map/Controls', module).add('Toggle map controls ', () => (
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
      }, boolean('Display draw tools', false) && {
        control: CONTROL_DRAW,
        position: CONTROLS_TOP_LEFT,
        onDrawActionable: onChange,
        onDrawCombine: onChange,
        onDrawCreate: onChange,
        onDrawModeChange: onChange,
        onDrawRender: onChange,
        onDrawUncombine: onChange,
        onDrawSelectionChange: onChange,
        onDrawUpdate: onChange,
        controls: {
          line_string: boolean('Display control "line_string"', true),
          polygon: boolean('Display control "polygon"', true),
          point: boolean('Display control "point"', true),
          trash: boolean('Display control "trash"', true),
          combine_features: boolean('Display control "combine_features"', true),
          uncombine_features: boolean('Display control "uncombine_features"', true),
        },
      }].filter(a => a)}
      translate={t}
    />
  </div>
), {
  info: {
    text: doc,
    styles: leftInfoButtonStyles,
  },
});
