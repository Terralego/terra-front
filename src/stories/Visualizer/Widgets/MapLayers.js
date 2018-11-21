import React from 'react';

import VisualizerProvider from '../../../modules/Visualizer';
import WidgetMap from '../../../modules/Visualizer/widgets/Map';

const LAYERSTREE = [{
  label: 'scenario 1',
  active: {
    layouts: [{
      id: 'background',
      visibility: 'visible',
    }, {
      id: 'road',
      paint: {
        'line-color': '#ff0000',
        'line-opacity': 0.1,
      },
    }],
  },
  inactive: {
    layouts: [{
      id: 'background',
      visibility: 'none',
    }, {
      id: 'road',
      paint: {
        'line-color': '#000000',
        'line-opacity': 1,
      },
    }],
  },
}, {
  label: 'scenario 2',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
      paint: {
        'line-color': '#0000ff',
        'line-opacity': 0.3,
      },
    }, {
      id: 'waterway',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      paint: {
        'line-color': '#000000',
      },
    }, {
      id: 'waterway',
      visibility: 'visible',
    }],
  },
}, {
  label: 'scenario 3',
  active: {
    layouts: [{
      id: 'road',
      visibility: 'none',
    }],
  },
  inactive: {
    layouts: [{
      id: 'road',
      visibility: 'visible',
    }],
  },
}];

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
