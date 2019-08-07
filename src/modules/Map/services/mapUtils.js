import bbox from '@turf/bbox';

import moize from 'moize';
import { PREFIXES } from './cluster';

const PREV_STATE = {};

export const getLayers = moize((map, layerId) => {
  const regexp = new RegExp(`^${layerId}(-(${PREFIXES.join('|')}))?(-[0-9]+)?$`);
  return map.getStyle().layers
    .filter(({ id }) => id.match(regexp));
});

export function toggleLayerVisibility (map, layerId, visibility) {
  getLayers(map, layerId)
    .forEach(({ id }) => map.setLayoutProperty(id, 'visibility', visibility));
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
  getLayers(map, layerId)
    .forEach(layer => {
      const property = getOpacityProperty(layer.type);
      if (property) {
        map.setPaintProperty(layer.id, property, opacity);
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
    const checkZoom = currentZoom <= maxZoom && currentZoom >= minZoom;

    const checkLayers = withLayers.reduce((prevCheck, layer) => {
      const match = layer.match(/^(!)?(.+)$/);

      const visible = match[1] !== '!';
      const layerId = match[2];
      return prevCheck && visible
        ? getLayers(map, layerId).reduce((subCheck, { id }) =>
          (subCheck ||
          map.getLayoutProperty(id, 'visibility') === 'visible'), false)
        : getLayers(map, layerId).reduce((subCheck, { id }) =>
          (subCheck &&
          map.getLayoutProperty(id, 'visibility') === 'none'), true);
    }, true);

    const checkCluster = isCluster === undefined
      || !!cluster === !!isCluster;

    return prev || (checkZoom && checkLayers && checkCluster);
  }, false);
};

let listenerWaiter = 0;

export function setInteractions ({ map, interactions, callback }) {
  const eventsTypes = new Set(interactions.reduce((triggers, { trigger = 'click' }) => [...triggers, trigger], []));

  // 'mouseover' is the trigger, 'mousemove' is the eventType
  if (eventsTypes.has('mouseover')) {
    eventsTypes.add('mousemove');
    eventsTypes.delete('mouseover');
  }

  let hoveringClickableLayer = 0;
  const uniqueHoveringEvents = {};
  const canvas = map.getCanvas();
  interactions.forEach(interaction => {
    // Display a pointer cursor over click zones for the given layer
    const { id, trigger = 'click' } = interaction;
    if (['click', 'mouseover'].includes(trigger) && !uniqueHoveringEvents[id]) {
      uniqueHoveringEvents[id] = true;
      map.on('mouseenter', id, () => {
        hoveringClickableLayer += 1;
        if (hoveringClickableLayer === 1) {
          canvas.style.cursor = 'pointer';
        }
      });
      map.on('mouseleave', id, () => {
        hoveringClickableLayer -= 1;
        if (hoveringClickableLayer === 0) {
          canvas.style.cursor = '';
        }
      });
    }

    // Mouseleave events for mouseover triggers
    // /!\ this listener MUST be before the mousemove
    if (trigger !== 'mouseover') return;

    const eventType = 'mouseleave';
    map.on(eventType, id, event => {
      callback({
        event,
        map,
        layerId: id,
        interaction,
        feature: PREV_STATE.point,
        eventType,
      });
    });
  });

  interactions.forEach(interaction => {
    const { id, trigger = 'click', constraints } = interaction;
    map.on(trigger === 'mouseover' ? 'mousemove' : trigger, id, e => {
      const { features } = e;

      if (!features.some(feature => !constraints || checkContraints({
        map,
        constraints,
        feature,
      }))) {
        return;
      }

      if (trigger === 'mouseover') {
        clearTimeout(listenerWaiter);
        listenerWaiter = setTimeout(() => {
          PREV_STATE.point = e.point;
          return callback({
            event: e,
            map,
            layerId: id,
            feature: features && features[0],
            interaction,
            eventType: 'mousemove',
          });
        }, 100);
      } else {
        callback({
          event: e,
          map,
          layerId: id,
          feature: features && features[0],
          interaction,
          eventType: trigger,
        });
      }
    });
  });
}

export function fitZoom ({ feature, map, padding = 0 }) {
  const features = feature.length ? feature : [feature];
  map.fitBounds(bbox({ type: 'FeatureCollection', features }), { padding });
}

export default {
  toggleLayerVisibility,
  getOpacityProperty,
  setLayerOpacity,
  setInteractions,
  checkContraints,
  fitZoom,
};
