import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import InteractiveMap, { InteractiveMap as PureInteractiveMap } from '../../../modules/Map/InteractiveMap';
import Legend from '../../../modules/Map/InteractiveMap/components/Legend';
import Map from '../../../modules/Map/Map';
import leftInfoButtonStyles from '../../leftInfosButtonStyles';
import doc from './InteractiveMap.md';

InteractiveMap.displayName = 'InteractiveMap';
PureInteractiveMap.displayName = 'InteractiveMap';
Legend.displayName = 'Legend';
Map.displayName = 'Map';

storiesOf('Map components/InteractiveMap', module).add('InteractiveMap', () => (
  <div style={{ height: '100vh' }}>
    <InteractiveMap
      type="map"
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle={[
        { label: 'Thème blanc', url: 'mapbox://styles/mapbox/light-v9' },
        { label: 'Thème noir', url: 'mapbox://styles/mapbox/dark-v9' },
        { label: 'satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
      ]}
      center={[5.386195159396806, 43.30072210972415]}
      zoom={15}
      maxZoom={16}
      minZoom={11}
      legends={[{
        title: 'Emplois',
        minZoom: 11,
        maxZoom: 13,
        layers: ['terralego-etablissements'],
        items: [
          { label: 'Mixte', color: '#fe0200' },
          { label: 'Tertiaire supérieur', color: '#6fab46' },
          { label: 'Commerce de gros/Logistique', color: '#fec000' },
          { label: 'Construction', color: '#a4a6a4' },
          { label: 'Activités supports', color: '#8ea8db' },
          { label: 'Industrie', color: '#245e91' },
          { label: 'Commerce de détail', color: '#ec7c31' },
          { label: 'Services aux particuliers', color: '#9e470e' },
          { label: 'Autres', color: '#6a89cc' },
        ],
      }, {
        title: 'Emplois',
        minZoom: 13,
        maxZoom: 16,
        layers: ['terralego-etablissements'],
        items: [
          { label: 'Mixte', color: '#fe0200' },
          { label: 'Tertiaire supérieur', color: '#6fab46' },
          { label: 'Commerce de gros/Logistique', color: '#fec000' },
        ],
      }]}
      interactions={[{
        id: 'terralego-eae-sync',
        interaction: 'highlight',
        trigger: 'mouseover',
        // unique: true, // Multiple selection or one by one
        // highlightColor: 'red', // if not set, it will take the default feature color
      },
      {
        id: 'terralego-eae-employment',
        interaction: 'highlight',
        trigger: 'mouseover',
        highlightColor: [
          'case',
          ['has', 'nb_emplois'],
          [
            'case',
            ['<', ['get', 'nb_emplois'], 600],
            '#ffb2b2',
            ['<', ['get', 'nb_emplois'], 2300],
            '#fe5c5c',
            ['<', ['get', 'nb_emplois'], 5200],
            '#fd3c3c',
            ['<', ['get', 'nb_emplois'], 12000],
            '#ab0e00',
            '#bd0202',
          ],
          '#ccc',
        ],
      }, {
        id: 'terralego-eae',
        interaction: 'displayTooltip',
        template: `
  {{nom_ppal}}
  `,
        constraints: [{
          minZoom: 14,
          maxZoom: 16,
        }],
      }, {
        id: 'terralego-eae',
        interaction: 'zoom',
        step: 1,
        constraints: [{
          minZoom: 0,
          maxZoom: 20,
        }],
      }, {
        id: 'terralego-etablissements',
        interaction: 'fitZoom',
      }, {
        id: 'terralego-etablissements',
        interaction: 'displayTooltip',
        fixed: boolean('fix tooltip', true),
        trigger: 'mouseover',
        template: `
    # Établissement

    * Siret : {{siret}}
    * Date de création :  {% if date_crea.length > 0 %}{{date_crea}}{% else %}Non connue{% endif %}
    * Raison sociale : {{raison_sociale}}
    * Nom commune : {{libcom}}
    * Activité principale exercée : {{libapet}}
    * Effectif{% if effectif_reel > 0 %}s{% endif %} salarié{% if effectif_reel > 0 %}s{% endif %} : {{effectif_reel}}
    * Vocation regroupée : {% if voc_regr.length > 0 %}{{voc_regr}}{% else %}Non connue{% endif %}
    `,
      }, {
        id: 'terralego-eae-employment',
        interaction: 'displayTooltip',
        trigger: 'mouseover',
        constraints: [{
          minZoom: 12,
          maxZoom: 14,
        }],
        template: 'Emploi',
      }]}
      customStyle={{
        sources: [{
          id: 'terralego',
          type: 'vector',
          url: 'https://dev-terralego-paca.makina-corpus.net/api/layer/reference/tilejson',
        }],
        layers: [{
          type: 'fill',
          source: 'terralego',
          id: 'terralego-eae',
          paint: {
            'fill-color': '#41b6c4',
            'fill-opacity': 0.4,
          },
          'source-layer': 'zae',
        }, {
          type: 'fill',
          source: 'terralego',
          id: 'terralego-eae-sync',
          paint: {
            'fill-color': [
              'match',
              ['get', 'voc_synth'],
              'Mixte', '#fe0200',
              'Tertiaire supérieur', '#6fab46',
              'Commerce de gros/Logistique', '#fec000',
              'Construction', '#a4a6a4',
              'Activités supports', '#8ea8db',
              'Industrie', '#245e91',
              'Commerce de détail', '#ec7c31',
              'Services aux particuliers', '#9e470e',
              '#6a89cc',
            ],
            'fill-opacity': 0.8,
          },
          'source-layer': 'zae',
        },
        {
          type: 'circle',
          source: 'terralego',
          id: 'terralego-eae-employment',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['zoom'],
              8,
              ['case', ['has', 'nb_emplois'],
                [
                  'case',
                  ['<', ['get', 'nb_emplois'], 600],
                  3,
                  ['<', ['get', 'nb_emplois'], 2300],
                  6,
                  ['<', ['get', 'nb_emplois'], 5200],
                  9,
                  ['<', ['get', 'nb_emplois'], 12000],
                  12,
                  15,
                ],
                0],
              16,
              ['case', ['has', 'nb_emplois'],
                [
                  'case',
                  ['<', ['get', 'nb_emplois'], 600],
                  30,
                  ['<', ['get', 'nb_emplois'], 2300],
                  60,
                  ['<', ['get', 'nb_emplois'], 5200],
                  90,
                  ['<', ['get', 'nb_emplois'], 12000],
                  120,
                  150,
                ],
                0],
            ],
            'circle-color': [
              'case',
              ['has', 'nb_emplois'],
              [
                'case',
                ['<', ['get', 'nb_emplois'], 600],
                '#ffffb2',
                ['<', ['get', 'nb_emplois'], 2300],
                '#fecc5c',
                ['<', ['get', 'nb_emplois'], 5200],
                '#fd8c3c',
                ['<', ['get', 'nb_emplois'], 12000],
                '#f03b1f',
                '#bd0226',
              ],
              '#fff',
            ],
          },
          'source-layer': 'zae-centroid',
        }, {
          type: 'circle',
          source: 'terralego',
          id: 'terralego-etablissements',
          'source-layer': 'etablissements',
          paint: {
            'circle-radius': [
              'case',
              ['has', 'point_count'],
              [
                'case',
                ['<', ['get', 'point_count'], 20],
                5,
                ['<', ['get', 'point_count'], 300],
                10,
                ['<', ['get', 'point_count'], 800],
                15,
                ['<', ['get', 'point_count'], 1200],
                20,
                25,
              ],
              0,
            ],
            'circle-color': [
              'case',
              ['has', 'point_count'],
              [
                'case',
                ['<', ['get', 'point_count'], 20],
                '#ffb3a8',
                ['<', ['get', 'point_count'], 300],
                '#d7887b',
                ['<', ['get', 'point_count'], 800],
                '#af5f51',
                ['<', ['get', 'point_count'], 1200],
                '#883729',
                '#600c00',
              ],
              '#fff',
            ],
          },
          asCluster: true,
        }],
      }}
    />
  </div>
), {
  info: {
    text: doc,
    styles: leftInfoButtonStyles,
    propTables: [PureInteractiveMap, Map],
  },
});
