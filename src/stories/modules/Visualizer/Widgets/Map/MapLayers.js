import React from 'react';

import VisualizerProvider from '../../../../../modules/Visualizer';
import WidgetMap from '../../../../../modules/Visualizer/widgets/Map';

import LAYERSTREE from '../../data/layersTree';

export default () => (
  <VisualizerProvider>
    <WidgetMap
      layersTree={LAYERSTREE}
      accessToken="pk.eyJ1IjoiaGFkcmllbmwiLCJhIjoiY2pueDgwZGhxMDVkbjN3cWx5dGlhd3p1eiJ9.FR_XylCvZZJLdB3No6Xxnw"
      styles="mapbox://styles/hadrienl/cjoplcnu821de2rs2cf0em4rw"
      center={[2.317600, 48.866500]}
      zoom={12.0}
      style={{ height: '90vh', display: 'flex' }}
      interactions={[{
        id: 'place-city-label-major',
        action: 'displayDetails',
      }]}
    />
  </VisualizerProvider>
);
