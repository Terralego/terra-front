import React from 'react';

import Map from '../../../modules/Map/Map';

export default () => (
  <div style={{ height: '100vh' }}>
    <Map
      type="map"
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle="mapbox://styles/mapbox/light-v9"
      center={[5.386195159396806, 43.30072210972415]}
      zoom={15}
      maxZoom={16}
      minZoom={11}
      legends={[{
        title: 'Emplois',
        layers: ['terralego-etablissements'],
        items: [
          { label: '< 20', color: '#ffb3a8' },
          { label: '< 300', color: '#d7887b' },
          { label: '< 800', color: '#af5f51' },
          { label: '< 1200', color: '#883729' },
          { label: '> 1200', color: '#600c00' },
        ],
      }]}
      customStyle={{
        sources: [{
          id: 'terralego',
          type: 'vector',
          url: 'http://dev-terralego-paca.makina-corpus.net/api/layer/reference/tilejson',
        }],
        layers: [{
          source: 'terralego',
          type: 'circle',
          id: 'terralego-etablissements',
          'source-layer': 'etablissements',
          cluster: {
            radius: 50,
            maxZoom: 16,
            steps: [2, 20, 300, 800, 1200],
            sizes: [5, 10, 15, 20, 22, 25],
            colors: ['#ffb3a8', '#ffb3a8', '#d7887b', '#af5f51', '#883729', '#600c00'],
            font: {
              color: '#ffffff',
            },
          },
        }],
      }}
    />
  </div>
);
