import { Marker } from 'mapbox-gl';
import { getLayerOpacity } from '../../services/mapUtils';
import piechart from './piechartMarker';


const STYLE_TYPE_MATCH = {
  piechart,
};

/**
 * Function used to create a Markers that are synced to a default hidden layer
 */
export default (type, layer, map) => {
  if (!layer || Object.keys(layer).length === 0) return;
  const markers = {};
  let markersOnScreen = {};
  let opacity = 1;
  const customMarker = STYLE_TYPE_MATCH[type];

  // Get Paint from layer but update properties to use them for "fake" layer
  const newPaint = Object.fromEntries(
    Object.entries(layer.paint || {}).map(([key, value]) => {
      const transformedKey = key.replace(`${type}-`, `${customMarker.targetType}-`);
      return [transformedKey, value];
    }),
  );

  const newLayer = {
    type: customMarker.targetType,
    id: layer.id,
    paint: {
      ...customMarker.defaultPaint,
      ...newPaint,
    },
    source: layer.source,
    ...(layer['source-layer'] ? { 'source-layer': layer['source-layer'] } : {}),
  };

  // Add "fake" layer to map
  map.addLayer(newLayer);

  /**
   * Function used to update markers, add new ones and remove those no longer visible
   */
  const updateMarkers = updateParameters => {
    if (!map.getLayer(layer.id) || map.getLayer(layer.id).visibility === 'none') {
      Object.values(markersOnScreen).forEach(marker => marker.remove());
      markersOnScreen = {};
      return;
    }
    const newMarkers = {};
    const features = map.queryRenderedFeatures({ layers: [layer.id] });

    const layerOpacity = getLayerOpacity(map, layer.id);

    // for every feature on the screen, create an HTML marker for it (if we didn't yet),
    // and add it to the map if it's not there already
    features.forEach(feature => {
      const coords = feature.geometry.coordinates;
      const idCoords = feature.geometry.coordinates.join('');
      const props = feature.properties;

      const { paint: layerPaint = {} } = feature.layer;

      let marker = markers[idCoords];
      if (!marker) {
        // createMarkers using the customMarker type
        const el = customMarker.createMarker(
          props,
          updateParameters,
          layerPaint,
        );
        marker = new Marker({
          element: el,
        }).setLngLat(coords);
        markers[idCoords] = marker;
      }
      newMarkers[idCoords] = marker;

      if (!markersOnScreen[idCoords]) marker.addTo(map);
    });
    // for every marker we've added previously, remove those that are no longer visible
    Object.keys(markersOnScreen).forEach(markerid => {
      if (!newMarkers[markerid]) markersOnScreen[markerid].remove();
    });
    markersOnScreen = newMarkers;

    // change opacity of markers without having to recreate them;
    if (layerOpacity !== opacity) {
      Object.values(markers).forEach(e => {
        customMarker.updateOpacity(e, layerOpacity);
      });
      opacity = layerOpacity;
    }
  };

  const updateParameters = customMarker.getUpdateParameters(layer);

  map.on('render', () => {
    if (!map.isSourceLoaded(layer.source)) return;
    updateMarkers(updateParameters);
  });
};
