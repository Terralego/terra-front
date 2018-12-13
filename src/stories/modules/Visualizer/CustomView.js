
import React from 'react';
import { storiesOf } from '@storybook/react';

import TerraFrontProvider from '../../../modules/TerraFrontProvider';
import VisualizerProvider, { View } from '../../../modules/Visualizer';
import layersTree from './data/layersTree';

const stories = storiesOf('Modules/Visualizer', module);

const MapNavigationCustomContentComponent = ({
  defaultContentComponent: ContentComponent,
  ...props
}) => (
  <>
    <p>Ceci est un composant personnalisé reprenant le composant par defaut</p>
    <ContentComponent {...props} />
  </>
);

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
              renderMapNavigation ({ defaultRender: MapNavigation, ...props }) {
                return (
                  <MapNavigation
                    {...props}
                    ContentComponent={MapNavigationCustomContentComponent}
                  />
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
            accessToken: 'pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ',
            backgroundStyle: 'mapbox://styles/mapbox/light-v9',
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
