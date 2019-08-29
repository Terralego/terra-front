import { getRelatedLayers } from '../../Map/services/mapUtils';

export function displayWarningAccordingToZoom (map, layer) {
  if (!map) return {};
  const currentZoom = map.getZoom();
  const layers = layer.layers.reduce((prev, layerId) =>
    [...prev, ...getRelatedLayers(map, layerId)], []);
  const layerZoom = layers
    .reduce(({ minzoom: prevMinzoom, maxzoom: prevMaxzoom }, { id }) => {
      const { minzoom = 0, maxzoom = 24 } = map.getLayer(id) || {};
      return {
        minzoom: Math.min(minzoom, prevMinzoom),
        maxzoom: Math.max(maxzoom, prevMaxzoom),
      };
    }, { minzoom: 24, maxzoom: 0 });
  const isNotDisplayed = currentZoom < layerZoom.minzoom || currentZoom > layerZoom.maxzoom;

  return { display: isNotDisplayed, minZoomLayer: layerZoom.minzoom };
}

export default { displayWarningAccordingToZoom };
