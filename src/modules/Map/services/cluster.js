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
      maxZoom: clusterMaxZoom = Math.floor(map.getMaxZoom()) + 1,
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
    layout: layerLayout = {},
    ...layerProps
  } = layer;
  const clusterSourceName = `${layer.id}-${PREFIX_SOURCE}-${index}`;
  const { filter } = layerProps;

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
    maxzoom: clusterMaxZoom,
    filter, // filter on the source enable cluster filtering
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
    type: 'circle',
    ...layerProps,
    id: `${id}-${PREFIX_UNCLUSTERED}-${index}`,
    source: clusterSourceName,
    filter: ['!', ['has', 'point_count']],
    paint: { ...layerPaint },
    layout: { ...layerLayout },
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
    id,
    source,
    'source-layer': sourceLayer,
    minzoom: layerMinzoom = 0,
    maxzoom: layerMaxzoom = 24,
    cluster: {
      radius: clusterRadius,
    },
  } = layer;
  const ghostLayerId = `${id}-cluster-data`;
  if (!map.getLayer(ghostLayerId)) {
    /**
     * A ghost layer to force data to be fetched
     */
    map.addLayer({
      id: `${id}-cluster-data`,
      type: 'circle',
      source,
      'source-layer': sourceLayer,
      minzoom: layerMinzoom,
      maxzoom: layerMaxzoom,
      paint: {
        'circle-color': 'transparent',
      },
    });
  }
  const zoom = map.getZoom();

  const sources = (Array.isArray(clusterRadius)
    ? [...clusterRadius]
    : [{ value: clusterRadius }])
    .map(({ value, minzoom = layerMinzoom, maxzoom = layerMaxzoom }, index) => {
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
      return clusterSourceName;
    });

  if (layerMinzoom > zoom || layerMaxzoom < zoom) return;

  const allFeatures = Array.from(
    map.querySourceFeatures(source, { sourceLayer })
      .reduce((all, feature) => {
        const { properties: { _id: featureId } } = feature;
        all.set(featureId, feature);
        return all;
      }, new Map()).values(),
  );

  const features = onClusterUpdate({
    features: allFeatures,
    source,
    sourceLayer,
  });

  sources.forEach(clusterSourceName => {
    map.getSource(clusterSourceName).setData({
      type: 'FeatureCollection',
      features,
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
