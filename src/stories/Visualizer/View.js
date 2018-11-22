
import React from 'react';
import { storiesOf } from '@storybook/react';

import VisualizerProvider, { View } from '../../modules/Visualizer/';
import layersTree from './data/layersTree';

const stories = storiesOf('Module Visualizer');

stories.add('View Component', () => (
  <VisualizerProvider>
    <div style={{ height: '100vh' }}>
      <View
        widgets={[{
          type: 'map',
          layersTree,
          accessToken: 'pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw',
          styles: 'mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw',
          center: [2.317600, 48.866500],
          zoom: 12.0,
          interactions: [{
            id: 'place-city-label-major',
            interaction: 'displayDetails',
          }],
        }]}
      />
    </div>
  </VisualizerProvider>
));
