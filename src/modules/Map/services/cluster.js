export const getClusterSourceName = id => `${id}-cluster-source`;

export const createCluster = (map, layer) => {
  const {
    id,
    source,
    'source-layer': sourceLayer,
    cluster: {
      maxZoom: clusterMaxZoom = 16,
      radius: clusterRadius = 50,
      steps,
      sizes,
      colors,
      font: { family, color } = {},
    },
  } = layer;
  const clusterSourceName = getClusterSourceName(layer.id);

  /**
   * A ghost layer to force data ro be fetched
   */
  map.addLayer({
    id: `${id}-for-cluster`,
    type: 'circle',
    source,
    'source-layer': sourceLayer,
    paint: {
      'circle-color': 'transparent',
    },
  });

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
    clusterRadius,
  });

  /**
   * The clustered layer
   */
  map.addLayer({
    id,
    type: 'circle',
    source: clusterSourceName,
    paint: {
      'circle-radius': [
        'case',
        ['has', 'point_count'],
        ['case',
          ...[...steps, null].reduce((rules, step, key) =>
            [
              ...rules,
              ...step
                ? [['<', ['get', 'point_count'], step], sizes[key]]
                : [sizes[key]],
            ],
          []),
        ], sizes[0]],
      'circle-color': [
        'case',
        ['has', 'point_count'],
        ['case',
          ...[...steps, null].reduce((rules, step, key) =>
            [
              ...rules,
              ...step
                ? [['<', ['get', 'point_count'], step], colors[key]]
                : [colors[key]],
            ],
          []),
        ], colors[0]],
    },
  });

  map.addLayer({
    id: `${id}-count`,
    type: 'symbol',
    source: clusterSourceName,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': family || ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': ['case',
        ...[...steps, null].reduce((rules, step, key) =>
          [
            ...rules,
            ...step
              ? [['<', ['get', 'point_count'], step], sizes[key]]
              : [sizes[key]],
          ],
        []),
      ],
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': color || '#000000',
    },
  });

  map.on('click', id, e => {
    const [{ properties: { cluster_id: clusterId } = {} }] = map.queryRenderedFeatures(e.point, { layers: [id] });
    if (!clusterId) return;
    map.getSource(clusterSourceName).getClusterLeaves(clusterId, -1, 0, (err, features) => {
      console.log(features);
    });
  });
  map.on('mouseenter', id, () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', id, () => {
    map.getCanvas().style.cursor = '';
  });
};

export const updateCluster = (map, layer) => {
  const { id, source, 'source-layer': sourceLayer } = layer;
  const clusterSourceName = getClusterSourceName(id);

  const features = map.querySourceFeatures(source, { sourceLayer });

  if (!map.getSource(clusterSourceName)) {
    createCluster(map, layer);
  }

  map.getSource(clusterSourceName).setData({
    type: 'FeatureCollection',
    features,
  });
};


export default { updateCluster };
