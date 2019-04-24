import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';

import { capitalize } from '../../../utils/strings';
import { updateCluster } from '../services/cluster';

import SearchControl from './components/SearchControl';
import SearchResults from './components/SearchResults';

import './Map.scss';

export function getLayerBeforeId (type, layers) {
  const sameTypes = layers.filter(({ type: lType }) => type === lType);

  if (!sameTypes.length) return undefined;

  const lastOfSameType = sameTypes[sameTypes.length - 1];

  const pos = layers.findIndex(({ id }) => id === lastOfSameType.id) + 1;

  return layers[pos] && layers[pos].id;
}

export class MapComponent extends React.Component {
  static propTypes = {
    // Mapbox general config
    accessToken: PropTypes.string,
    displayScaleControl: PropTypes.bool,
    displayNavigationControl: PropTypes.bool,
    displayAttributionControl: PropTypes.bool,
    displaySearchControl: PropTypes.bool,
    onSearch: PropTypes.func,
    renderSearchResults: PropTypes.func,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxBounds: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.array), PropTypes.bool]),
    rotate: PropTypes.bool,

    // Action to fly out to coordinates
    flyTo: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      zoom: PropTypes.number,
      speed: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      curve: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      easing: PropTypes.func,
    }),

    customStyle: PropTypes.shape({
      sources: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['vector']).isRequired,
        url: PropTypes.string,
        tiles: PropTypes.arrayOf(PropTypes.string),
      })),
      layers: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        source: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        'source-layer': PropTypes.string,
        type: PropTypes.oneOf(['fill', 'line', 'symbol', 'circle', 'heatmap', 'fill-extrusion', 'raster', 'hillshade', 'background']).isRequired,
        paint: PropTypes.object,
        layout: PropTypes.shape({
          visibility: PropTypes.oneOf(['visible', 'none']),
        }),
        asCluster: PropTypes.bool,
      })),
    }),

    onBackgroundChange: PropTypes.func,
  };

  static defaultProps = {
    accessToken: '',
    displayScaleControl: true,
    displayNavigationControl: true,
    displayAttributionControl: true,
    displaySearchControl: false,
    onSearch () {},
    renderSearchResults: SearchResults,
    maxZoom: 20,
    minZoom: 0,
    maxBounds: false,
    rotate: false,
    flyTo: {},
    customStyle: {},
    onBackgroundChange () {},
  };

  mapListeners = [];

  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  // TODO : move to WidgetMap
  updateFlyTo = (prevFlyToConfig, flyToConfig) => {
    if (prevFlyToConfig !== flyToConfig) {
      const { map: { flyTo } } = this.props;
      flyTo(flyToConfig);
    }
  }

  updateMapProperties = prevProps => {
    const {
      map,
      maxZoom,
      backgroundStyle,
      customStyle,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
      displaySearchControl,
      minZoom,
      maxBounds,
      rotate,
      flyTo,
    } = this.props;

    this.updateFlyTo(prevProps.flyTo, flyTo);

    if (prevProps.maxBounds !== maxBounds) {
      map.setMaxBounds(maxBounds);
    }

    if (prevProps.maxZoom !== maxZoom) {
      map.setMaxZoom(maxZoom);
    }

    if (prevProps.minZoom !== minZoom) {
      map.setMinZoom(minZoom);
    }

    if (prevProps.backgroundStyle !== backgroundStyle) {
      map.once('style.load', () => this.backgroundChanged(backgroundStyle));
      map.setStyle(backgroundStyle, { diff: false });
    }

    if (displayScaleControl !== prevProps.displayScaleControl) {
      this.toggleDisplayScaleControl(displayScaleControl);
    }

    if (displayNavigationControl !== prevProps.displayNavigationControl) {
      this.toggleNavigationControl(displayNavigationControl);
    }

    if (displayAttributionControl !== prevProps.displayAttributionControl) {
      this.toggleAttributionControl(displayAttributionControl);
    }

    if (rotate !== prevProps.rotate) {
      this.toggleRotate();
    }

    if (JSON.stringify(customStyle) !== JSON.stringify(prevProps.customStyle)) {
      this.replaceLayers(prevProps.customStyle);
    }

    if (prevProps.displaySearchControl !== displaySearchControl) {
      this.toggleSearchControl();
    }
  }

  async initMapProperties () {
    const {
      accessToken,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
    } = this.props;

    mapBoxGl.accessToken = accessToken;

    this.createLayers();

    this.toggleDisplayScaleControl(displayScaleControl);

    this.toggleNavigationControl(displayNavigationControl);

    this.toggleAttributionControl(displayAttributionControl);

    this.toggleRotate();

    this.toggleSearchControl();
  }

  backgroundChanged (backgroundStyle) {
    const { onBackgroundChange } = this.props;
    this.createLayers();
    onBackgroundChange(backgroundStyle);
  }

  createLayers () {
    const { map, customStyle: { sources = [], layers = [] } } = this.props;
    const { layers: allLayers } = map.getStyle();
    sources.forEach(({ id, ...sourceAttrs }) => map.addSource(id, sourceAttrs));
    layers.forEach(layer => {
      if (layer.cluster) return this.createClusterLayer(layer);
      const { type } = layer;
      const beforeId = getLayerBeforeId(type, allLayers);
      return map.addLayer(layer, beforeId);
    });
  }

  createClusterLayer (layer) {
    const { map, onClusterUpdate } = this.props;
    map.on('zoomend', () => updateCluster(map, layer, onClusterUpdate));
    map.on('moveend', () => updateCluster(map, layer, onClusterUpdate));
    map.on('refreshCluster', () => updateCluster(map, layer, onClusterUpdate));
    map.once('load', () => updateCluster(map, layer, onClusterUpdate));
    updateCluster(map, layer, onClusterUpdate);
    const listener = ({ isSourceLoaded }) => {
      const { onMapUpdate } = this.props;
      if (isSourceLoaded) {
        onMapUpdate(map);
        map.off('sourcedata', listener);
      }
    };
    map.on('sourcedata', listener);
  }

  deleteLayers ({ sources, layers }) {
    const { map } = this.props;
    const { layers: allLayers } = map.getStyle();
    sources.forEach(({ id, ...sourceAttrs }) => {
      if (!map.getSource(id)) return;
      map.removeSource(id, sourceAttrs);
    });
    layers.forEach(layer => {
      const { type } = layer;
      if (!map.getLayer(layer)) return;
      const beforeId = getLayerBeforeId(type, allLayers);
      map.removeLayer(layer, beforeId);
    });
  }

  replaceLayers (prevCustomStyle) {
    this.deleteLayers(prevCustomStyle);
    this.createLayers();
  }

  toggleControl (display, control) {
    const { map } = this.props;
    const controlAttributeName = `${control}Control`;
    const controlMethod = capitalize(controlAttributeName);

    if (this[controlAttributeName] && !display) {
      map.removeControl(this[controlAttributeName]);
      delete this[controlAttributeName];
    }

    if (display) {
      if (this[controlAttributeName]) {
        map.removeControl(this[controlAttributeName]);
      }
      this[controlAttributeName] = new mapBoxGl[controlMethod]();
      map.addControl(this[controlAttributeName]);
    }
  }

  toggleAttributionControl (display) {
    return this.toggleControl(display, 'attribution');
  }

  toggleNavigationControl (display) {
    return this.toggleControl(display, 'navigation');
  }

  toggleDisplayScaleControl (display) {
    return this.toggleControl(display, 'scale');
  }

  toggleRotate () {
    const { map, rotate } = this.props;
    if (rotate) {
      map.touchZoomRotate.enableRotation();
    } else {
      map.touchZoomRotate.disableRotation();
    }
  }

  toggleSearchControl () {
    const { map, displaySearchControl, onSearch, renderSearchResults } = this.props;

    if (!displaySearchControl && this.searchControl) {
      map.removeControl(this.searchControl);
    }
    if (displaySearchControl) {
      this.searchControl = new SearchControl();
      map.addControl(this.searchControl, 'top-right');
    }
  }

  render () {
    return null;
  }
}

export default MapComponent;
