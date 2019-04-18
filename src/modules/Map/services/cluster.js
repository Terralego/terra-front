export const PREFIX_SOURCE = 'cluster-source';
export const PREFIX_UNCLUSTERED = 'unclustered';
export const PREFIX_COUNT = 'count';
export const PREFIXES = [PREFIX_UNCLUSTERED, PREFIX_COUNT];

export const getPaintExpression = (steps, values) => ['case',
  ...[...steps, null].reduce((rules, step, key) =>
    [
      ...rules,
      ...step
        ? [['<', ['get', 'point_count'], step], values[key]]
        : [values[key]],
    ],
  []),
];

export const createClusterLayers = ({
  map, layer, radius, minzoom = 0, maxzoom = 24, index,
}) => {
  const {
    id,
    source,
    'source-layer': sourceLayer,
    cluster: {
      maxZoom: clusterMaxZoom = 16,
      steps,
      sizes,
      colors,
      font: {
        family = ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        color = '#000000',
      } = {},
      border = 5,
      paint: clusterPaint = {},
    },
    paint: layerPaint = {},
    ...layerProps
  } = layer;
  const clusterSourceName = `${layer.id}-${PREFIX_SOURCE}-${index}`;

  /**
   * The new source filled with features from tiles converted to geojson
   */
  map.addSource(clusterSourceName, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    cluster: true,
    clusterMaxZoom,
    clusterRadius: radius,
    maxzoom: 24,
  });

  const paint = {
    ...clusterPaint,
    'circle-radius': getPaintExpression(steps, sizes),
    'circle-color': getPaintExpression(steps, colors),
    'circle-stroke-width': border,
    'circle-stroke-opacity': 0.4,
    'circle-stroke-color': getPaintExpression(steps, colors),
  };

  /**
   * The clustered layer
   */
  map.addLayer({
    ...layerProps,
    id: `${id}-${index}`,
    type: 'circle',
    source: clusterSourceName,
    filter: ['has', 'point_count'],
    paint: { ...paint },
    minzoom,
    maxzoom,
  });

  /**
   * The no-clustered layer
   */
  map.addLayer({
    ...layerProps,
    id: `${id}-${PREFIX_UNCLUSTERED}-${index}`,
    type: 'circle',
    source: clusterSourceName,
    filter: ['!', ['has', 'point_count']],
    paint: { ...layerPaint },
    minzoom,
    maxzoom,
  });

  /**
   * The count layer
   */
  map.addLayer({
    ...layerProps,
    id: `${id}-${PREFIX_COUNT}-${index}`,
    type: 'symbol',
    source: clusterSourceName,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': family,
      'text-size': getPaintExpression(steps, sizes),
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': color,
    },
    minzoom,
    maxzoom,
  });
};

export const updateCluster = (map, layer, onClusterUpdate = ({ features }) => features) => {
  const {
    id, source, 'source-layer': sourceLayer,
    minzoom: layerMinzoom = 0,
    maxzoom: layerMaxzoom = 24,
    cluster: {
      radius: clusterRadius,
    },
  } = layer;

  const ghostLayerId = `${id}-cluster-data`;
  if (!map.getLayer(ghostLayerId)) {
    /**
     * A ghost layer to force data ro be fetched
     */
    map.addLayer({
      id: `${id}-cluster-data`,
      type: 'circle',
      source,
      'source-layer': sourceLayer,
      paint: {
        'circle-color': 'transparent',
      },
    });
  }

  const features = map.querySourceFeatures(source, { sourceLayer });

  (Array.isArray(clusterRadius)
    ? [...clusterRadius]
    : [{ value: clusterRadius }])
    .forEach(({ value, minzoom = layerMinzoom, maxzoom = layerMaxzoom }, index) => {
      const clusterSourceName = `${id}-${PREFIX_SOURCE}-${index}`;
      if (!map.getSource(clusterSourceName)) {
        createClusterLayers({
          map,
          layer,
          radius: value,
          minzoom,
          maxzoom,
          index,
        });
      }
      map.getSource(clusterSourceName).setData({
        type: 'FeatureCollection',
        features: onClusterUpdate({ features, source, sourceLayer }),
      });
    });
};

export const getClusteredFeatures = (map, feature = {}) => new Promise(resolve => {
  const { source, properties: { cluster, cluster_id: clusterId } = {} } = feature;
  if (!cluster) resolve(null);
  else {
    map.getSource(source).getClusterLeaves(clusterId, -1, 0, (err, features = null) =>
      resolve(features));
  }
});


export default { updateCluster, getClusteredFeatures };
