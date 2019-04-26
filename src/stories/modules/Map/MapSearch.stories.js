import React from 'react';
import { storiesOf } from '@storybook/react';
import { Classes } from '@blueprintjs/core';

import { boolean } from '@storybook/addon-knobs';

import Map from '../../../modules/Map/Map';
import doc from './MapSearch.md';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';

Map.displayName = 'Map';

function t (key) {
  switch (key) {
    case 'terralego.map.search_results.title':
      return 'Résultats de recherche';
    case 'terralego.map.search_results.no_result':
      return 'Pas de résultat';
    case 'terralego.map.search_control.button_label':
      return 'Rechercher';
    default:
      return key;
  }
}

const onSearch = () => new Promise(resolve => {
  setTimeout(() => resolve([{
    group: 'Points d\'échanges intermodaux',
    results: [],
  }, {
    group: 'EAE',
    results: [{
      label: 'Parc d\'activité de Fontvieille',
      center: [5.4859932, 43.3271871],
      bounds: [],
    }, {
      label: 'Parc d\'activité du Grand Rhone',
      center: [4.6289983, 43.7061469],
      bounds: [],
    }, {
      label: 'Technopole Agroparc',
      center: [4.8902474, 43.9164238],
      bounds: [],
    }],
  }]), 500);
});

storiesOf('Modules/Map/', module).add('Search in Map', () => (
  <div
    style={{ width: '100vw', height: '100vh' }}
    className={boolean('Dark theme', true) ? Classes.DARK : ''}
  >
    <Map
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle="mapbox://styles/mapbox/light-v9"
      maxZoom={20}
      minZoom={0}
      maxBounds={[[-5.7283633634, 42.114925591], [8.8212564471, 51.3236272327]]} // Should be tried with https://boundingbox.klokantech.com/
      zoom={10} // set default zoom
      displaySearchControl={boolean('Display search', true)}
      onSearch={onSearch}
      translate={t}
    />
  </div>
), {
  info: {
    text: doc,
    styles: leftInfoButtonStyles,
  },
});
