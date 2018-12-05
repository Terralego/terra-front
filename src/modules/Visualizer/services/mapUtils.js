export function toggleLayerVisibility (map, layerId, visibility) {
  map.setLayoutProperty(layerId, 'visibility', visibility);
}

export default { toggleLayerVisibility };
