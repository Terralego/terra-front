import React from 'react';
import { storiesOf } from '@storybook/react';

import { boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import HomeControl from '../../../modules/Map/Map/components/HomeControl';

import {
  CONTROLS_TOP_RIGHT,
  CONTROLS_TOP_LEFT,
  CONTROL_DRAW,
  CONTROL_CAPTURE,
  CONTROL_NAVIGATION,
  CONTROL_SEARCH,
  CONTROL_PRINT,
  CONTROL_HOME,
  CONTROL_SHARE,
  CONTROL_CUSTOM,
  CONTROL_REPORT,
} from '../../../modules/Map/Map';
import InteractiveMap, {
  CONTROL_BACKGROUND_STYLES,
} from '../../../modules/Map/InteractiveMap';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';

import doc from './MapControls.md';

const onSearch = () => new Promise(resolve => {
  setTimeout(() => resolve([{
    group: 'Points d\'échanges intermodaux',
    results: [],
  }, {
    group: 'EAE',
    total: 42,
    results: [{
      label: 'Parc d\'activité de Fontvieille',
      center: [5.4859932, 43.3271871],
    }, {
      label: 'Parc d\'activité du Grand Rhone',
      center: [4.6289983, 43.7061469],
    }, {
      label: 'Technopole Agroparc',
      center: [4.8902474, 43.9164238],
    }, {
      label: 'Autre Parc d\'activité de Fontvieille',
      center: [5.4859932, 43.3271871],
    }, {
      label: 'Autre Parc d\'activité du Grand Rhone',
      center: [4.6289983, 43.7061469],
    }, {
      label: 'Autre Technopole Agroparc',
      center: [4.8902474, 43.9164238],
    }],
  }]), 500);
});

const onChange = event => {
  const title = 'Trigger action:';
  // eslint-disable-next-line no-console
  console.log(event);
  action(title)(event.type);
};

storiesOf('Map components/InteractiveMap', module).add('Custom controls ', () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <InteractiveMap
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle={[{ label: 'light', url: 'mapbox://styles/mapbox/light-v9' }, { label: 'light aussi', url: 'mapbox://styles/mapbox/light-v9' }]}
      maxZoom={20}
      minZoom={0}
      center={[5.386195159396806, 43.30072210972415]}
      maxBounds={[[-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327]]} // Should be tried with https://boundingbox.klokantech.com/
      zoom={10} // set default zoom
      controls={[boolean('Display Search control', true, CONTROL_SEARCH) && {
        control: CONTROL_SEARCH,
        position: CONTROLS_TOP_RIGHT,
        onSearch,
        onSearchResultClick: ({ result }) => action('Click on search result')(result),
        disabled: boolean('Disable Search control', false, CONTROL_SEARCH),
      }, boolean('Display Home control', true, CONTROL_HOME) && {
        control: CONTROL_HOME,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Home control', false, CONTROL_HOME),
      }, {
        control: CONTROL_NAVIGATION,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Navigation control', false, CONTROL_NAVIGATION),
      }, boolean('Display Background styles control', true, CONTROL_BACKGROUND_STYLES) && {
        control: CONTROL_BACKGROUND_STYLES,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Background styles control', false, CONTROL_BACKGROUND_STYLES),
      }, boolean('Display Capture control', true, CONTROL_CAPTURE) && {
        control: CONTROL_CAPTURE,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Capture control', false, CONTROL_CAPTURE),
      }, boolean('Display Print control', true, CONTROL_PRINT) && {
        control: CONTROL_PRINT,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Print control', false, CONTROL_PRINT),
      }, boolean('Display Share control', false, CONTROL_SHARE) && {
        control: CONTROL_SHARE,
        position: CONTROLS_TOP_RIGHT,
        disabled: boolean('Disable Share control', false, CONTROL_SHARE),
        link: boolean('Activate link', true, CONTROL_SHARE),
        twitter: boolean('Activate twitter', true, CONTROL_SHARE),
        facebook: boolean('Activate facebook', true, CONTROL_SHARE),
        linkedin: boolean('Activate linkedin', true, CONTROL_SHARE),
        initialState: object('Initial state', {}, CONTROL_SHARE),
      }, boolean('Display Draw tools control', false, CONTROL_DRAW) && {
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
        disabled: boolean('Disable Draw tools control', false, CONTROL_DRAW),
        controls: {
          line_string: boolean('Display control "line_string"', true, CONTROL_DRAW),
          polygon: boolean('Display control "polygon"', true, CONTROL_DRAW),
          point: boolean('Display control "point"', true, CONTROL_DRAW),
          trash: boolean('Display control "trash"', true, CONTROL_DRAW),
          combine_features: boolean('Display control "combine_features"', true, CONTROL_DRAW),
          uncombine_features: boolean('Display control "uncombine_features"', true, CONTROL_DRAW),
        },
      }, boolean('Display Custom control', true, CONTROL_CUSTOM) && {
        control: CONTROL_CUSTOM,
        position: CONTROLS_TOP_LEFT,
        instance: HomeControl,
      }, boolean('Display Report Control', true, CONTROL_REPORT) && {
        control: CONTROL_REPORT,
        position: CONTROLS_TOP_RIGHT,
      },
      ].filter(Boolean)}
    />
  </div>
), {
  info: {
    text: doc,
    styles: leftInfoButtonStyles,
  },
});
