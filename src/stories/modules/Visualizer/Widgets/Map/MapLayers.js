import React from 'react';

import VisualizerProvider from '../../../../../modules/Visualizer';
import WidgetMap from '../../../../../modules/Visualizer/widgets/Map';

import LAYERSTREE from '../../data/layersTree';

export default () => (
  <VisualizerProvider>
    <WidgetMap
      layersTree={LAYERSTREE}
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
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
