export function toggleLayerVisibility (map, layerId, visibility) {
  map.setLayoutProperty(layerId, 'visibility', visibility);
}

export function addListenerOnLayer (map, layerId, fn, { trigger = 'click', displayCursor } = {}) {
  const listeners = [];
  const triggerListener = map.on(trigger, layerId, e => {
    fn(layerId, e.features, e);
  });
  listeners.push(triggerListener);

  if (displayCursor) {
    const mouseenterListener = map.on('mouseenter', layerId, () => {
      const canvas = map.getCanvas();
      canvas.style.cursor = 'pointer';
    });
    const mouseleaveListener = map.on('mouseleave', layerId, () => {
      const canvas = map.getCanvas();
      canvas.style.cursor = '';
    });
    listeners.push(mouseenterListener);
    listeners.push(mouseleaveListener);
  }

  return listeners;
}

export function getOpacityProperty (type) {
  switch (type) {
    case 'background':
      return 'background-opacity';
    case 'fill':
      return 'fill-opacity';
    case 'line':
      return 'line-opacity';
    case 'symbol':
      return 'icon-opacity';
    case 'raster':
      return 'raster-opacity';
    case 'circle':
      return 'circle-opacity';
    case 'fill-extrusion':
      return 'fill-extrusion-opacity';
    default:
      return null;
  }
}

export function setLayerOpacity (map, layerId, opacity) {
  const layer = map.getLayer(layerId);
  const property = getOpacityProperty(layer.type);
  if (property) {
    map.setPaintProperty(layerId, property, opacity);
  }
}

export default { toggleLayerVisibility };
