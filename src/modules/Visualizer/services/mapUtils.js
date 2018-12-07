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

export default { toggleLayerVisibility };
