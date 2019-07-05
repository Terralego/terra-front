import { getLayers } from '../../../../Map/services/mapUtils';

export function getMinMax (values, minThreshold = 0, maxThreshold = 24) {
  return values.reduce((
    { minzoom: prevMinZoom, maxzoom: prevMaxZoom },
    { minzoom = minThreshold, maxzoom = maxThreshold },
  ) => ({
    minzoom: Math.min(prevMinZoom, minzoom),
    maxzoom: Math.max(prevMaxZoom, maxzoom),
  }), { minzoom: maxThreshold, maxzoom: minThreshold });
}

export function displayWarningAccordingToZoom (map, layer) {
  if (!map) return {};

  const currentZoom = map.getZoom();

  const layers = layer.layers.reduce((prev, layerId) =>
    [...prev, ...getLayers(map, layerId)], []);

  const sourcesIds = [...new Set(layers.reduce((prev, { source }) => [...prev, source], []))];

  const sources = sourcesIds.map(sourceId => ({
    minzoom: map.getSource(sourceId).minzoom,
    maxzoom: map.getSource(sourceId).maxzoom,
  }));

  const zoomSources = getMinMax(sources);
  const zoomLayers = getMinMax(layers, zoomSources.minzoom, zoomSources.maxzoom);

  const layerIsVisible = (currentZoom >= zoomLayers.minzoom)
    && (currentZoom <= zoomLayers.maxzoom);

  return { display: layerIsVisible === false, minZoomLayer: zoomLayers.minzoom };
}

export default { displayWarningAccordingToZoom };
