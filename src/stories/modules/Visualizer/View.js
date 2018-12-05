
import React from 'react';
import { storiesOf } from '@storybook/react';

import VisualizerProvider, { View } from '../../../modules/Visualizer';

const layersTree = [{
  label: 'regions',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-regions',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-regions',
      visibility: 'none',
    }],
  },
}, {
  label: 'Departements',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-departements',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-departements',
      visibility: 'none',
    }],
  },
}, {
  label: 'SCOT',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-scot',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-scot',
      visibility: 'none',
    }],
  },
}, {
  label: 'EPCI',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-ecpi',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-epci',
      visibility: 'none',
    }],
  },
}, {
  label: 'EAE',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-zae',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-zae',
      visibility: 'none',
    }],
  },
}, {
  label: 'Établissements',
  initialState: {
    active: false,
  },
  active: {
    layouts: [{
      id: 'terralego-etablissements',
      visibility: 'visible',
    }],
  },
  inactive: {
    layouts: [{
      id: 'terralego-etablissements',
      visibility: 'none',
    }],
  },
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
            id: 'place-city-label-major',
            interaction: 'displayDetails',
            template: `
# La ville de {{name_fr}}
            `,
          }, {
            id: 'place-neighborhood-suburb-label',
            interaction: 'displayTooltip',
            template: `
Le quartier de {{name_fr}}
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
                type: 'fill',
                source: 'terralego',
                id: 'terralego-epci',
                paint: {
                  'fill-color': 'hsl(220, 100%, 45%)',
                },
                layout: {
                  visibility: 'none',
                },
                'source-layer': 'epci',
              },
              {
                type: 'fill',
                source: 'terralego',
                id: 'terralego-zae',
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
