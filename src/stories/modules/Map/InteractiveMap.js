import React from 'react';

import { boolean } from '@storybook/addon-knobs';

import InteractiveMap from '../../../modules/Map/InteractiveMap';

export default () => (
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
      interactions={[{
        id: 'terralego-eae',
        interaction: 'displayTooltip',
        template: `
{{nom_ppal}}
`,
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
);
