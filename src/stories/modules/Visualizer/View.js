import React from 'react';

import InteractiveMap from '../../../modules/Map/InteractiveMap';

const layersTree = [{
  group: 'Limites administratives',
  layers: [{
    label: 'Departements',
    initialState: {
      active: false,
    },
    layers: ['terralego-departements'],
  }, {
    label: 'EPCI',
    initialState: {
      active: false,
    },
    layers: ['terralego-epci'],
  }],
}, {
  group: 'Périmètre d\'urbanisme',
  layers: [{
    label: 'SCOT',
    initialState: {
      active: false,
    },
    layers: ['terralego-scot'],
  }],
}, {
  group: 'Bâtiments',
  layers: [{
    label: 'Établissements',
    initialState: {
      active: false,
    },
    layers: ['terralego-etablissements'],
  }],
}, {
  group: 'EAE',
  layers: [{
    label: 'EAE',
    initialState: {
      active: false,
    },
    sublayers: [{
      label: 'Toutes',
      layers: ['terralego-eae'],
    }, {
      label: 'par vocation',
      layers: ['terralego-eae-sync'],
      legend: {
        items: [
          { label: 'Mixte', color: '#fe0200' },
          { label: 'Tertiaire supérieur', color: '#6fab46' },
          { label: 'Commerce de gros/Logistique', color: '#fec000' },
          { label: 'Construction', color: '#a4a6a4' },
          { label: 'Activités supports', color: '#8ea8db' },
          { label: 'Industrie', color: '#245e91' },
          { label: 'Commerce de détail', color: '#ec7c31' },
          { label: 'Services aux particuliers', color: '#9e470e' },
          { label: 'Autres', color: '#6a89cc' },
        ],
      },
    }],
  }],
}];

export default () => (
  <div style={{ height: '100vh' }}>
    <InteractiveMap
      type="map"
      layersTree={layersTree}
      accessToken="pk.eyJ1IjoibWFraW5hY29ycHVzIiwiYSI6ImNqY3E4ZTNwcTFta3ozMm80d2xzY29wM2MifQ.Nwl_FHrWAIQ46s_lY0KNiQ"
      backgroundStyle={[
        { label: 'Thème blanc', url: 'mapbox://styles/mapbox/light-v9' },
        { label: 'Thème noir', url: 'mapbox://styles/mapbox/dark-v9' },
        { label: 'satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
      ]}
      center={[5.386195159396806, 43.30072210972415]}
      zoom={15}
      maxZoom={16}
      minZoom={11}
      interactions={[{
        id: 'terralego-eae',
        interaction: 'displayDetails',
        template: `
[{{nom_ppal}}](https://fiches.sud-foncier-eco.fr/espaces-d-activites/{{id_eae}})
* {{bbox}}
* {{comdeta_et}}
* {{comdetail_eff}}
* {{comgr_et}}
* {{comgros_eff}}
* {{const_eff}}
* {{const_et}}
* {{date_crea}}
* {{date_maj}}
* {{geom}}
* {{geom3857}}
* {{id}}
* {{id_eae}}
* {{id_scot}}
* {{id_zone}}
* {{identifier}}
* {{indus_eff}}
* {{indus_et}}
* {{insee_comm}}
* {{insee_epci}}
* {{layer_id}}
* {{logis_eff}}
* {{logis_et}}
* {{nb_emplois}}
* {{nom_ppal}}
* {{nonpres_eff}}
* {{nonpres_et}}
* {{parti_eff}}
* {{parti_et}}
* {{pres_eff}}
* {{pres_et}}
* {{ray_eae}}
* {{supp_eff}}
* {{supp_et}}
* {{surf_total}}
* {{tertisup_eff}}
* {{tertisup_et}}
* {{type_esp}}
* {{voc_decl}}
* {{voc_dom}}
* {{voc_synth}}
            `,
      }, {
        id: 'terralego-eae',
        interaction: 'displayTooltip',
        trigger: 'mouseover',
        template: `
# {{nom_ppal}}

* Surface : {{surf_total}}km2
* CP : {{insee_comm}}
* Commune : à trouver
`,
      }, {
        id: 'terralego-etablissements',
        interaction: 'displayTooltip',
        trigger: 'mouseover',
        template: 'Etablissement',
      }, {
        id: 'terralego-etablissements',
        interaction: 'displayDetails',
        template: 'Etablissement',
      }]}
      customStyle={{
        sources: [{
          id: 'terralego',
          type: 'vector',
          url: 'http://dev-tiles-paca.makina-corpus.net/api/layer/__nogroup__/tilejson',
        }],
        layers: [
          {
            id: 'cadastre',
            type: 'raster',
            minzoom: 14,
            source: {
              type: 'raster',
              tiles: [
                'https://gpp3-wxs.ign.fr/6ldzy836lrz6uea2qmzawkwe/geoportail/wmts?LAYER=CADASTRALPARCELS.PARCELS&EXCEPTIONS=text/xml&FORMAT=image/png&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&STYLE=bdparcellaire_o&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
              ],
              tileSize: 256,
            },
            layout: {
              visibility: 'none',
            },
          }, {
            type: 'line',
            source: 'terralego',
            id: 'terralego-departements',
            paint: {
              'line-color': '#66c2a4',
              'line-width': 2,
            },
            layout: {
              visibility: 'visible',
            },
            'source-layer': 'departements',
          }, {
            type: 'line',
            source: 'terralego',
            id: 'terralego-communes',
            paint: {
              'line-color': '#66c2a4',
              'line-opacity': 0.4,
              'line-width': 1,
            },
            layout: {
              visibility: 'visible',
            },
            'source-layer': 'communes',
          }, {
            type: 'line',
            source: 'terralego',
            id: 'terralego-scot',
            paint: {
              'line-color': '#fe9929',
              'line-width': 1,
            },
            layout: {
              visibility: 'none',
            },
            'source-layer': 'scot',
          }, {
            type: 'line',
            source: 'terralego',
            id: 'terralego-epci',
            paint: {
              'line-color': '#f768a1',
              'line-width': 2,
            },
            layout: {
              visibility: 'none',
            },
            'source-layer': 'epci',
          },
          {
            type: 'fill',
            source: 'terralego',
            id: 'terralego-eae',
            layout: {
              visibility: 'visible',
            },
            paint: {
              'fill-color': '#41b6c4',
              'fill-opacity': 0.4,
            },
            'source-layer': 'zae',
          },
          {
            type: 'fill',
            source: 'terralego',
            id: 'terralego-eae-sync',
            layout: {
              visibility: 'none',
            },
            paint: {
              'fill-color': [
                'match',
                ['get', 'voc_synth'],
                'Mixte', '#fe0200',
                'Tertiaire supérieur', '#6fab46',
                'Commerce de gros/Logistique', '#fec000',
                'Construction', '#a4a6a4',
                'Activités supports', '#8ea8db',
                'Industrie', '#245e91',
                'Commerce de détail', '#ec7c31',
                'Services aux particuliers', '#9e470e',
                '#6a89cc',
              ],
              'fill-opacity': 0.8,
            },
            'source-layer': 'zae',
          },
          {
            type: 'circle',
            source: 'terralego',
            id: 'terralego-eae-employment',
            layout: {
              visibility: 'none',
            },
            paint: {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                8,
                ['case', ['has', 'nb_emplois'],
                  [
                    'case',
                    ['<', ['get', 'nb_emplois'], 600],
                    3,
                    ['<', ['get', 'nb_emplois'], 2300],
                    6,
                    ['<', ['get', 'nb_emplois'], 5200],
                    9,
                    ['<', ['get', 'nb_emplois'], 12000],
                    12,
                    15,
                  ],
                  0],
                16,
                ['case', ['has', 'nb_emplois'],
                  [
                    'case',
                    ['<', ['get', 'nb_emplois'], 600],
                    30,
                    ['<', ['get', 'nb_emplois'], 2300],
                    60,
                    ['<', ['get', 'nb_emplois'], 5200],
                    90,
                    ['<', ['get', 'nb_emplois'], 12000],
                    120,
                    150,
                  ],
                  0],
              ],
              'circle-color': [
                'case',
                ['has', 'nb_emplois'],
                [
                  'case',
                  ['<', ['get', 'nb_emplois'], 600],
                  '#ffffb2',
                  ['<', ['get', 'nb_emplois'], 2300],
                  '#fecc5c',
                  ['<', ['get', 'nb_emplois'], 5200],
                  '#fd8c3c',
                  ['<', ['get', 'nb_emplois'], 12000],
                  '#f03b1f',
                  '#bd0226',
                ],
                '#fff',
              ],
            },
            'source-layer': 'zae-centroid',
          }, {
            type: 'fill',
            source: 'terralego',
            id: 'terralego-industrie',
            paint: {
              'fill-color': '#ae8964',
              'fill-opacity': 0.4,
            },
            'source-layer': 'territoire_industrie',
          }, {
            type: 'circle',
            source: 'terralego',
            id: 'terralego-etablissements',
            'source-layer': 'etablissements',
          },
        ],
      }}
    />
  </div>
);
