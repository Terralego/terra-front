import { getRelatedLayers } from '../../Map/services/mapUtils';

export function displayWarningAccordingToZoom (map, layer) {
  if (!map) return {};

  const currentZoom = map.getZoom();
  const layers = layer.layers.reduce((prev, layerId) =>
    [
      ...prev,
      ...(layer.group
        // If layer is a group, layers will be an array of layers.
        // We need to merge all layer ids of all layers of the group
        ? layerId.layers.reduce((subPrev, id) => [
          ...subPrev,
          ...getRelatedLayers(map, id),
        ], [])
        // In the other hand, we just need to read the layers related
        // to the id
        : getRelatedLayers(map, layerId)),
    ], []);
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
