
import React from 'react';
import { storiesOf } from '@storybook/react';

import TerraFrontProvider from '../../modules/TerraFrontProvider';
import VisualizerProvider, { View } from '../../modules/Visualizer';
import layersTree from './data/layersTree';

const stories = storiesOf('Module Visualizer');

stories.add('Custom View', () => (
  <TerraFrontProvider
    config={{
      modules: {
        Visualizer: {
          components: {
            View: {
              DetailsComponent ({ name_fr: name }) {
                return (
                  <p style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: 'red',
                      color: 'white',
                      padding: '1rem',
                    }}
                  >
                    Vous êtes à {name}
                  </p>
                );
              },
            },
          },
          widgets: {
            Map: {
              renderLayersTree ({ layersTree: layers, onToggleChange, isActive }) {
                return (
                  <div>
                    <h2>Un site spécifique avec un navigation différente</h2>
                    {layers.map(layer => (
                      <p>
                        {layer.label}
                        <button
                          onClick={onToggleChange(layer)}
                        >
                          {isActive(layer) ? 'désactiver' : 'activer'}
                        </button>
                      </p>
                    ))}
                  </div>
                );
              },
            },
          },
        },
      },
    }}
  >
    <VisualizerProvider>
      <div style={{ height: '100vh' }}>
        <View
          widgets={[{
            type: 'map',
            layersTree,
            accessToken: 'pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw',
            styles: 'mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw',
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
          }]}
        />
      </div>
    </VisualizerProvider>
  </TerraFrontProvider>
));
