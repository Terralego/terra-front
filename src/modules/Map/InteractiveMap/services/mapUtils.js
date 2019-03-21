const PREV_STATE = {};

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
    const checkZoom = currentZoom <= maxZoom && currentZoom >= minZoom;

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
      || !!cluster === !!isCluster;

    return prev || (checkZoom && checkLayers && checkCluster);
  }, false);
};

export function getInteractionsOnEvent ({
  eventType,
  map,
  point,
  interactions: eventInteractions,
}) {
  const features = map.queryRenderedFeatures(point);

  let interactions = false;

  features.some(feature => {
    const { layer: { id: layerId } } = feature;

    const foundInteractions = eventInteractions.filter(({ id, trigger = 'click', constraints }) => {
      const found = id === layerId;

      if (constraints && !checkContraints({ map, constraints, feature })) {
        return false;
      }

      return found &&
        eventType === (trigger === 'mouseover' ? 'mousemove' : trigger);
    });

    if (!foundInteractions.length) return false;

    interactions = {
      interactions: foundInteractions,
      feature,
      layerId,
    };

    return true;
  });

  return interactions;
}

export function setInteractions ({ map, interactions, callback }) {
  const eventsTypes = new Set(interactions.reduce((triggers, { trigger = 'click' }) => [...triggers, trigger], []));

  if (eventsTypes.has('mouseover')) {
    eventsTypes.add('mousemove');
    eventsTypes.delete('mouseover');
  }

  /**
   * Mouseleave events for mouseover triggers
   * /!\ this listener MUST be before the mousemove
   */
  interactions.forEach(interaction => {
    const { id, trigger } = interaction;
    if (trigger !== 'mouseover') return;

    const eventType = 'mouseleave';
    map.on(eventType, id, event => {
      const features = map.queryRenderedFeatures(PREV_STATE.point);
      const feature = features.find(({ layer: { id: layerId } }) => id === layerId);
      callback({ event, map, layerId: id, interaction, feature, eventType });
    });
  });

  eventsTypes.forEach(eventType => {
    map.on(eventType, e => {
      const { target, point } = e;
      if (eventType === 'mousemove') {
        PREV_STATE.point = point;
      }
      const interactionsSpec = getInteractionsOnEvent({
        eventType,
        map: target,
        point,
        interactions,
      });

      if (!interactionsSpec) return;

      const { interactions: filteredInteractionsSpec, feature, layerId } = interactionsSpec;
      filteredInteractionsSpec.forEach(interaction =>
        callback({ event: e, map, layerId, feature, interaction, eventType }));
    });
  });

  /**
   *  Display a pointer cursor over click zones
   */
  map.on('mousemove', e => {
    const { target, point } = e;
    const interactionsSpec = getInteractionsOnEvent({
      eventType: 'click',
      map: target,
      point,
      interactions,
    });

    const canvas = target.getCanvas();
    if (interactionsSpec) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = '';
    }
  });
}

export default {
  toggleLayerVisibility,
  getOpacityProperty,
  setLayerOpacity,
  getInteractionsOnEvent,
  setInteractions,
  checkContraints,
};
