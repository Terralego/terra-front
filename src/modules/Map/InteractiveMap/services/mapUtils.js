export function toggleLayerVisibility (map, layerId, visibility) {
  map.setLayoutProperty(layerId, 'visibility', visibility);
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

export function getInteractionOnEvent ({ eventType, map, point, interactions }) {
  const features = map.queryRenderedFeatures(point);
  let interaction = false;

  features.some(feature => {
    const { layer: { id: layerId } } = feature;

    const foundInteraction = interactions.find(({ id, trigger = 'click' }) => {
      const found = id === layerId;

      return found &&
        eventType === (trigger === 'mouseover' ? 'mousemove' : trigger);
    });

    if (!foundInteraction) return false;

    interaction = {
      interaction: foundInteraction,
      feature,
      layerId,
    };

    return true;
  });

  return interaction;
}

export function setInteractions ({ map, interactions, callback }) {
  const eventsTypes = new Set(interactions.reduce((triggers, { trigger = 'click' }) => [...triggers, trigger], []));

  if (eventsTypes.has('mouseover')) {
    eventsTypes.add('mousemove');
    eventsTypes.delete('mouseover');
  }

  eventsTypes.forEach(eventType => {
    map.on(eventType, e => {
      const { target, point } = e;
      const interactionSpec = getInteractionOnEvent({
        eventType,
        map: target,
        point,
        interactions,
      });

      if (!interactionSpec) return;

      const { interaction, feature, layerId } = interactionSpec;

      callback({ event: e, map, layerId, feature, interaction, eventType });
    });
  });

  /**
   * Mouseleave events for mouseover triggers
   */
  interactions.forEach(interaction => {
    const { id, trigger } = interaction;
    if (trigger !== 'mouseover') return;

    const eventType = 'mouseleave';
    map.on(eventType, id, event => {
      callback({ event, map, layerId: id, interaction, eventType });
    });
  });

  /**
   *  Display a pointer cursor over click zones
   */
  map.on('mousemove', e => {
    const { target, point } = e;
    const interactionSpec = getInteractionOnEvent({
      eventType: 'click',
      map: target,
      point,
      interactions,
    });

    const canvas = target.getCanvas();
    if (interactionSpec) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = '';
    }
  });
}

export const checkContraints = ({
  map,
  constraints = [],
  feature: { properties: { cluster } = {} } = {},
}) => {
  if (!constraints.length) return true;
  const currentZoom = map.getZoom();
  return constraints.reduce((prev, {
    minZoom = 0,
    maxZoom = Infinity,
    withLayers = [],
    isCluster,
  }) => {
    const checkZoom = minZoom !== undefined && maxZoom !== undefined
      ? currentZoom <= maxZoom && currentZoom >= minZoom
      : true;

    const checkLayers = withLayers.reduce((prevCheck, layer) => {
      const match = layer.match(/^(!)?(.+)$/);

      const visible = match[1] !== '!';
      const layerId = match[2];

      return prevCheck
        && visible
        ? (map.getLayer(layerId) !== undefined
          && map.getLayoutProperty(layerId, 'visibility') === 'visible')
        : (!map.getLayer(layerId)
          || map.getLayoutProperty(layerId, 'visibility') === 'none');
    }, true);
    const checkCluster = isCluster === undefined
      || cluster === isCluster;

    return prev || (checkZoom && checkLayers && checkCluster);
  }, false);
};

export default {
  toggleLayerVisibility,
  getOpacityProperty,
  setLayerOpacity,
  getInteractionOnEvent,
  setInteractions,
  checkContraints,
};
