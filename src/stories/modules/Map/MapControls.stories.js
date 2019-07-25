import React from 'react';
import { storiesOf } from '@storybook/react';

import { boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import {
  CONTROLS_TOP_RIGHT,
  CONTROLS_TOP_LEFT,
  CONTROL_DRAW,
  CONTROL_CAPTURE,
  CONTROL_NAVIGATION,
  CONTROL_SEARCH,
  CONTROL_PRINT,
  CONTROL_HOME,
} from '../../../modules/Map/Map';
import InteractiveMap, {
  CONTROL_BACKGROUND_STYLES,
} from '../../../modules/Map/InteractiveMap';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';

import doc from './MapControls.md';

const t = (key, params) => {
  switch (key) {
    case 'terralego.map.search_results.title':
      return 'Résultats de recherche';
    case 'terralego.map.search_results.no_result':
      return 'Pas de résultat';
    case 'terralego.map.search_control.button_label':
      return 'Rechercher';
    case 'terralego.map.search_results.group_total':
      return `(${params.count} result found)`;
    case 'terralego.map.capture_control.button_label':
      return 'capture';
    default:
      return key;
  }
};

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

storiesOf('Modules/Map/Controls', module).add('Toggle map controls ', () => (
  <div
    style={{ width: '100vw', height: '100vh' }}
  >
    <InteractiveMap
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle={[{ label: 'light', url: 'mapbox://styles/mapbox/light-v9' }, { label: 'light aussi', url: 'mapbox://styles/mapbox/light-v9' }]}
      maxZoom={20}
      minZoom={0}
      center={[5.386195159396806, 43.30072210972415]}
      maxBounds={[[-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327]]} // Should be tried with https://boundingbox.klokantech.com/
      zoom={10} // set default zoom
      controls={[boolean('Display search', true) && {
        control: CONTROL_SEARCH,
        position: CONTROLS_TOP_RIGHT,
        onSearch,
        onSearchResultClick: ({ result }) => action('Click on search result')(result),
      }, boolean('Display home', true) && {
        control: CONTROL_HOME,
        position: CONTROLS_TOP_RIGHT,
      }, {
        control: CONTROL_NAVIGATION,
        position: CONTROLS_TOP_RIGHT,
      }, boolean('Display background styles', true) && {
        control: CONTROL_BACKGROUND_STYLES,
        position: CONTROLS_TOP_RIGHT,
      }, boolean('Display capture', true) && {
        control: CONTROL_CAPTURE,
        position: CONTROLS_TOP_RIGHT,
      }, boolean('Display print', true) && {
        control: CONTROL_PRINT,
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
