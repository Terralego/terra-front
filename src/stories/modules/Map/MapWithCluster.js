import React from 'react';

import InteractiveMap from '../../../modules/Map/InteractiveMap';

export default () => (
  <div style={{ height: '100vh' }}>
    <InteractiveMap
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
          paint: {
            'circle-color': [
              'match',
              ['get', 'apet700_ta5_corres_naf'],
              'Activité support', '#8dd3c7',
              'Agriculture', '#ffff66',
              'Commerce détail', '#bebada',
              'Commerce de gros', '#fb8072',
              'Construction', '#80b1d3',
              'Industrie', '#fdb462',
              'Logistique', '#b3de69',
              'Services aux particuliers', '#fccde5',
              'Services tertiaire supérieur', '#8c8c8c',
              '#777',
            ],
          },
        }],
      }}
      interactions={[{
        id: 'terralego-etablissements',
        interaction: 'displayTooltip',
        template: `
{% if clusteredFeatures.length > 800 and zoom < 15 %}
<p>Trop de résultats, ayez l'obligeance de zoomer, merci.</p>
{% else %}
<ul style="max-height: 300px; overflow: auto">
  {% for feature in clusteredFeatures %}
  <li>{{feature.properties.raison_sociale}}</li>
  {% endfor %}
</ul>
{% endif %}
`,
        fixed: true,
      }]}
    />
  </div>
);
