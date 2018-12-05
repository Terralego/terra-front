
import React from 'react';
import { storiesOf } from '@storybook/react';

import VisualizerProvider, { View } from '../../../modules/Visualizer/';
import layersTree from './data/layersTree';

const stories = storiesOf('Modules/Visualizer', module);

stories.add('View Component', () => (
  <VisualizerProvider>
    <div style={{ height: '100vh' }}>
      <View
        widgets={[{
          type: 'map',
          layersTree,
          accessToken: 'pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw',
          backgroundStyle: 'mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw',
          center: [1.4133102599149652, 43.5881904444511],
          zoom: 12.0,
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
              id: 'test',
              type: 'vector',
              url: 'mapbox://mapbox.mapbox-streets-v7',
            }],
            layers: [
              {
                layout: {},
                type: 'fill',
                source: 'test',
                id: 'foo',
                paint: {
                  'fill-color': 'hsl(231, 36%, 77%)',
                },
                'source-layer': 'water',
              },
              {
                layout: {},
                type: 'fill',
                source: 'test',
                id: 'bar',
                paint: {
                  'fill-color': 'hsl(220, 100%, 45%)',
                },
                'source-layer': 'landuse',
              },
            ],
          },
        }]}
      />
    </div>
  </VisualizerProvider>
));
