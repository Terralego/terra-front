
import React from 'react';
import { storiesOf } from '@storybook/react';

import VisualizerProvider, { View } from '../../../modules/Visualizer';

const layersTree = [{
  label: 'regions',
  initialState: {
    active: false,
  },
  layers: ['terralego-regions'],
}, {
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
}];

const stories = storiesOf('Modules/Visualizer', module);

stories.add('View Component', () => (
  <VisualizerProvider>
    <div style={{ height: '100vh' }}>
      <View
        widgets={[{
          type: 'map',
          layersTree,
          accessToken: 'pk.eyJ1IjoidGFzdGF0aGFtMSIsImEiOiJjamZ1ejY2bmYxNHZnMnhxbjEydW9sM29hIn0.w9ndNH49d91aeyvxSjKQqg',
          backgroundStyle: 'mapbox://styles/mapbox/light-v9',
          center: [5.386195159396806, 43.30072210972415],
          zoom: 11,
          maxZoom: 16,
          minZoom: 11,
          interactions: [{
            id: 'terralego-eae',
            interaction: 'displayDetails',
            template: `
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
            layers: [
              {
                type: 'line',
                source: 'terralego',
                id: 'terralego-regions',
                paint: {
                  'line-color': 'rgb(255, 0, 0)',
                  'line-width': 5,
                },
                layout: {
                  visibility: 'none',
                },
                'source-layer': 'regions',
              },
              {
                type: 'line',
                source: 'terralego',
                id: 'terralego-departements',
                paint: {
                  'line-color': 'hsl(265, 36%, 77%)',
                  'line-width': 2,
                },
                layout: {
                  visibility: 'none',
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
                layout: {
                  visibility: 'none',
                },
                'source-layer': 'epci',
              },
              {
                type: 'fill',
                source: 'terralego',
                id: 'terralego-eae',
                layout: {
                  visibility: 'none',
                },
                paint: {
                  'fill-color': 'hsl(220, 100%, 45%)',
                },
                'source-layer': 'zae',
              }, {
                type: 'fill',
                source: 'terralego',
                id: 'terralego-etablissements',
                paint: {
                  'fill-color': 'hsl(220, 100%, 45%)',
                },
                layout: {
                  visibility: 'none',
                },
                'source-layer': 'etablissements',
              },
            ],
          },
        }]}
      />
    </div>
  </VisualizerProvider>
));
