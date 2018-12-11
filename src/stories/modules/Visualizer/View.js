
import React from 'react';
import { storiesOf } from '@storybook/react';

import VisualizerProvider, { View } from '../../../modules/Visualizer';

const layersTree = [{
  group: 'Afficher',
  layers: [{
    label: 'Departements',
    initialState: {
      active: false,
    },
    layers: ['terralego-departements'],
  }, {
    label: 'SCOT',
    initialState: {
      active: false,
    },
    layers: ['terralego-scot'],
  }, {
    label: 'EPCI',
    initialState: {
      active: false,
    },
    layers: ['terralego-epci'],
  }, {
    label: 'EAE',
    initialState: {
      active: false,
    },
    layers: ['terralego-eae'],
  }, {
    label: 'Établissements',
    initialState: {
      active: false,
    },
    layers: ['terralego-etablissements'],
  }],
}, {
  group: 'Analyser',
  layers: [{
    label: 'EAE par vocation',
    initialState: {
      active: true,
    },
    layers: ['terralego-eae-vocation'],
    legend: {
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
    },
  }],
}];

const stories = storiesOf('Modules/Visualizer', module);

stories.add('View Component', () => (
  <VisualizerProvider>
    <div style={{ height: '100vh' }}>
      <View
        widgets={[{
          type: 'map',
          layersTree,
          accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
          backgroundStyle: [
            { label: 'Thème blanc', url: 'mapbox://styles/mapbox/light-v9' },
            { label: 'Thème noir', url: 'mapbox://styles/mapbox/dark-v9' },
            { label: 'satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
          ],
          center: [5.386195159396806, 43.30072210972415],
          zoom: 15,
          maxZoom: 16,
          minZoom: 11,
          interactions: [{
            id: 'terralego-eae',
            interaction: 'displayDetails',
            template: `
[{{nom_ppal}}](https://fiches.sud-foncier-eco.fr/espaces-d-activites/{{id_eae}})
* {{bbox}}
* {{comdeta_et}}
* {{comdetail_eff}}
* {{comgr_et}}
* {{comgros_eff}}
* {{const_eff}}
* {{const_et}}
* {{date_crea}}
* {{date_maj}}
* {{geom}}
* {{geom3857}}
* {{id}}
* {{id_eae}}
* {{id_scot}}
* {{id_zone}}
* {{identifier}}
* {{indus_eff}}
* {{indus_et}}
* {{insee_comm}}
* {{insee_epci}}
* {{layer_id}}
* {{logis_eff}}
* {{logis_et}}
* {{nb_emplois}}
* {{nom_ppal}}
* {{nonpres_eff}}
* {{nonpres_et}}
* {{parti_eff}}
* {{parti_et}}
* {{pres_eff}}
* {{pres_et}}
* {{ray_eae}}
* {{supp_eff}}
* {{supp_et}}
* {{surf_total}}
* {{tertisup_eff}}
* {{tertisup_et}}
* {{type_esp}}
* {{voc_decl}}
* {{voc_dom}}
* {{voc_synth}}
            `,
          }, {
            id: 'terralego-eae',
            interaction: 'displayTooltip',
            trigger: 'mouseover',
            template: `
# {{nom_ppal}}

* Surface : {{surf_total}}km2
* CP : {{insee_comm}}
* Commune : à trouver
`,
          }],
          customStyle: {
            sources: [{
              id: 'terralego',
              type: 'vector',
              tiles: [
                'http://a-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://b-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://c-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://d-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://e-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://f-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
                'http://j-dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tiles/{z}/{x}/{y}/',
              ],
            }],
            layers: [{
              type: 'line',
              source: 'terralego',
              id: 'terralego-regions',
              paint: {
                'line-color': 'rgb(255, 0, 0)',
                'line-width': 5,
              },
              'source-layer': 'regions',
            }, {
              type: 'line',
              source: 'terralego',
              id: 'terralego-departements',
              paint: {
                'line-color': 'hsl(265, 36%, 77%)',
                'line-width': 2,
              },
              'source-layer': 'departements',
            }, {
              type: 'fill',
              source: 'terralego',
              id: 'terralego-scot',
              paint: {
                'fill-color': 'hsl(220, 100%, 45%)',
              },
              layout: {
                visibility: 'none',
              },
              'source-layer': 'scot',
            },
            {
              type: 'line',
              source: 'terralego',
              id: 'terralego-epci',
              paint: {
                'line-color': 'hsl(220, 100%, 45%)',
              },
              'source-layer': 'epci',
            },
            {
              type: 'fill',
              source: 'terralego',
              id: 'terralego-eae',
              paint: {
                'fill-color': 'hsl(220, 100%, 45%)',
              },
              'source-layer': 'zae',
            }, {
              type: 'circle',
              source: 'terralego',
              id: 'terralego-etablissements',
              paint: {
                'circle-radius': {
                  base: 1.75,
                  stops: [[12, 2], [22, 180]],
                },
              },
              'source-layer': 'etablissements',
            }, {
              type: 'fill',
              source: 'terralego',
              id: 'terralego-eae-vocation',
              layout: {
                visibility: 'visible',
              },
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
            }],
          },
        }]}
      />
    </div>
  </VisualizerProvider>
));
