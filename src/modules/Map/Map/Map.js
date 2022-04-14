import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { detailedDiff } from 'deep-object-diff';

import { LAYER_TYPES_ORDER, getControlName } from '../services/mapUtils';
import { updateCluster } from '../services/cluster';

import SearchControl from './components/SearchControl';
import SearchResults from './components/SearchResults';
import CaptureControl from './components/CaptureControl';
import DrawControl from './components/DrawControl';
import PrintControl from './components/PrintControl';
import HomeControl from './components/HomeControl';
import ShareControl from './components/ShareControl';
import ReportControl from './components/ReportControl';
import PathControl from './components/PathControl';
import WidgetControl from './components/WidgetControl';

import translateMock from '../../../utils/translate';

import './Map.scss';

export const CONTROLS_TOP_LEFT = 'top-left';
export const CONTROLS_TOP_RIGHT = 'top-right';
export const CONTROLS_BOTTOM_LEFT = 'bottom-left';
export const CONTROLS_BOTTOM_RIGHT = 'bottom-right';

export const CONTROL_ATTRIBUTION = 'AttributionControl';
export const CONTROL_NAVIGATION = 'NavigationControl';
export const CONTROL_SCALE = 'ScaleControl';
export const CONTROL_SEARCH = 'SearchControl';
export const CONTROL_CAPTURE = 'CaptureControl';
export const CONTROL_DRAW = 'DrawControl';
export const CONTROL_PATH = 'PathControl';
export const CONTROL_PRINT = 'PrintControl';
export const CONTROL_HOME = 'HomeControl';
export const CONTROL_SHARE = 'ShareControl';
export const CONTROL_CUSTOM = 'CustomControl';
export const CONTROL_REPORT = 'ReportControl';
export const CONTROL_WIDGET = 'WidgetControl';

export const DEFAULT_CONTROLS = [{
  control: CONTROL_ATTRIBUTION,
  position: CONTROLS_BOTTOM_RIGHT,
}, {
  control: CONTROL_NAVIGATION,
  position: CONTROLS_TOP_RIGHT,
}, {
  control: CONTROL_SCALE,
  position: CONTROLS_BOTTOM_LEFT,
}];

const defaultTranslate = translateMock({
  'terralego.map.draw_control.point': 'Marker',
  'terralego.map.draw_control.polygon': 'Polygon',
  'terralego.map.draw_control.line': 'LineString',
  'terralego.map.draw_control.trash': 'Delete',
  'terralego.map.draw_control.combine': 'Combine',
  'terralego.map.draw_control.uncombine': 'Uncombine',
});

export class MapComponent extends React.Component {
  static propTypes = {
    // Mapbox general config
    accessToken: PropTypes.string,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxBounds: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.array),
      PropTypes.bool,
    ]),
    rotate: PropTypes.bool,
    controls: PropTypes.arrayOf(PropTypes.shape({
      position: PropTypes.oneOf([
        CONTROLS_BOTTOM_LEFT,
        CONTROLS_BOTTOM_RIGHT,
        CONTROLS_TOP_LEFT,
        CONTROLS_TOP_RIGHT,
      ]).isRequired,
      control: PropTypes.oneOfType([
        PropTypes.oneOf([
          CONTROL_ATTRIBUTION,
          CONTROL_NAVIGATION,
          CONTROL_SCALE,
          CONTROL_SEARCH,
          CONTROL_CAPTURE,
          CONTROL_DRAW,
          CONTROL_PATH,
          CONTROL_PRINT,
          CONTROL_HOME,
          CONTROL_SHARE,
          CONTROL_CUSTOM,
          CONTROL_REPORT,
        ]),
        PropTypes.shape({
          onAdd: PropTypes.func,
          onRemove: PropTypes.func,
        }),
      ]).isRequired,
      // For CONTROL_SEARCH only
      onSearch: PropTypes.func,
      renderSearchResults: PropTypes.func,
      onSearchResultClick: PropTypes.func,
    })),

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
        type: PropTypes.oneOf(LAYER_TYPES_ORDER).isRequired,
        paint: PropTypes.object,
        layout: PropTypes.shape({
          visibility: PropTypes.oneOf(['visible', 'none']),
        }),
        cluster: PropTypes.shape({
          radius: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.arrayOf(PropTypes.shape({
              value: PropTypes.number,
              maxzoom: PropTypes.number,
            })),
          ]),
          steps: PropTypes.arrayOf(PropTypes.number),
          size: PropTypes.arrayOf(PropTypes.number),
          colors: PropTypes.arrayOf(PropTypes.string),
          font: PropTypes.shape({
            color: PropTypes.string,
          }),
          border: PropTypes.number,
        }),
      })),
    }),
    onBackgroundChange: PropTypes.func,
    translate: PropTypes.func,
  };

  static defaultProps = {
    accessToken: '',
    maxZoom: 20,
    minZoom: 0,
    maxBounds: false,
    rotate: false,
    flyTo: {},
    customStyle: {},
    onBackgroundChange () {},
    controls: DEFAULT_CONTROLS,
    translate: defaultTranslate,
  };

  controls = [];

  mapListeners = [];

  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  componentWillUnmount () {
    const { map } = this.props;
    this.controls.forEach(control => map.removeControl(control));
  }

  // TODO : move to WidgetMap
  updateFlyTo = (prevFlyToConfig, flyToConfig) => {
    if (prevFlyToConfig !== flyToConfig) {
      const { map: { flyTo } } = this.props;
      flyTo(flyToConfig);
    }
  };

  updateMapProperties = prevProps => {
    const {
      map,
      maxZoom,
      backgroundStyle,
      customStyle,
      controls,
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

    if (controls !== prevProps.controls) {
      this.resetControls();
    }

    if (rotate !== prevProps.rotate) {
      this.toggleRotate();
    }

    if (customStyle !== prevProps.customStyle) {
      this.replaceLayers(prevProps.customStyle, customStyle);
    }
  };

  focusOnSearchResult = ({ center, bounds }) => {
    const { map } = this.props;
    if (bounds) {
      map.fitBounds(bounds, {
        padding: 10,
      });
      return;
    }
    if (center) {
      map.setCenter(center);
    }
  };

  onSearchResultClick = onResultClick => ({ result, ...rest }) => {
    const { map } = this.props;
    if (onResultClick) {
      onResultClick({
        result,
        ...rest,
        map,
        focusOnSearchResult: this.focusOnSearchResult,
      });
    } else {
      this.focusOnSearchResult(result);
    }
  };

  initMapProperties () {
    const {
      accessToken,
    } = this.props;

    mapBoxGl.accessToken = accessToken;

    this.createLayers();

    this.resetControls();

    this.toggleRotate();
  }

  backgroundChanged (backgroundStyle) {
    const { map, onBackgroundChange } = this.props;
    this.createLayers();
    onBackgroundChange(backgroundStyle, map);
  }

  createLayers () {
    const { customStyle } = this.props;
    this.addLayers(customStyle);
  }

  addLayers ({ sources = [], layers = [] }) {
    const { map } = this.props;

    sources.forEach(({ id, ...sourceAttrs }) => map.addSource(id, sourceAttrs));

    layers.forEach(layer => {
      if (layer.cluster) return this.createClusterLayer(layer);
      return map.addLayer(layer);
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
        updateCluster(map, layer, onClusterUpdate);
        map.off('sourcedata', listener);
      }
    };
    map.on('sourcedata', listener);
  }

  removeLayers ({ sources = [], layers = [] }) {
    const { map } = this.props;

    layers.forEach(({ id }) => {
      if (!map.getLayer(id)) return;
      map.removeLayer(id);
    });
    sources.forEach(({ id, ...sourceAttrs }) => {
      if (!map.getSource(id)) return;
      map.removeSource(id, sourceAttrs);
    });
  }

  replaceLayers (prevCustomStyle, customStyle) {
    const { added, deleted, updated } = detailedDiff(prevCustomStyle, customStyle);
    const getDiffWith = type => (action, style) => (
      !action[type]
        ? []
        : Object.keys(action[type]).map(index => style[type][Number(index)])
    );

    const getDiffWithSources = getDiffWith('sources');
    const getDiffWithLayers = getDiffWith('layers');

    const getListDiffed = (action, style = {}) => [
      getDiffWithSources(action, style),
      getDiffWithLayers(action, style),
    ];

    const [deletedSources, deletedLayers] = getListDiffed(deleted, prevCustomStyle);
    const [updatedSources, updatedLayers] = getListDiffed(updated, customStyle);
    const [addedSources, addedLayers] = getListDiffed(added, customStyle);

    const stylesToRemove = {
      sources: [...deletedSources, ...updatedSources],
      layers: [...deletedLayers, ...updatedLayers],
    };
    const stylesToAdd = {
      sources: [...addedSources, ...updatedSources],
      layers: [...addedLayers, ...updatedLayers],
    };

    if (stylesToRemove.sources.length || stylesToRemove.layers.length) {
      this.removeLayers(stylesToRemove);
    }

    if (stylesToAdd.sources.length || stylesToAdd.layers.length) {
      this.addLayers(stylesToAdd);
    }
  }

  toggleRotate () {
    const { map, rotate } = this.props;
    if (rotate) {
      map.touchZoomRotate.enableRotation();
    } else {
      map.touchZoomRotate.disableRotation();
    }
  }

  resetControls () {
    const { controls, map, translate } = this.props;
    const props = {
      ...this.props,
      translate: translate === defaultTranslate ? undefined : translate,
    };

    // Remove all previous controls
    this.controls.forEach(control => map.removeControl(control));
    this.controls = [];

    // Add new controls
    controls.forEach(({ position, control, ...params }) => {
      switch (control) {
        case CONTROL_SEARCH: {
          const controlInstance = new SearchControl({
            ...props,
            renderSearchResults: SearchResults,
            ...params,
            onResultClick: this.onSearchResultClick(params.onSearchResultClick),
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_CAPTURE: {
          const controlInstance = new CaptureControl({
            ...props,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_DRAW: {
          const controlInstance = new DrawControl({
            map,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);

          const container = map.getContainer();
          const drawControlLocales = {
            point: translate('terralego.map.draw_control.point'),
            polygon: translate('terralego.map.draw_control.polygon'),
            line: translate('terralego.map.draw_control.line'),
            trash: translate('terralego.map.draw_control.trash'),
            combine: translate('terralego.map.draw_control.combine'),
            uncombine: translate('terralego.map.draw_control.uncombine'),
          };
          Object.entries(drawControlLocales).forEach(([drawControl, translation]) => {
            const domElement = container.querySelector(`.mapbox-gl-draw_${drawControl}`);

            if (domElement) {
              domElement.setAttribute('title', translation);
            }
          });
          break;
        }
        case CONTROL_PRINT: {
          const controlInstance = new PrintControl({
            ...props,
            map,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_HOME: {
          const { fitBounds, center, zoom } = props;
          const { coordinates, ...fitBoundsParams } = fitBounds || {};
          const controlInstance = new HomeControl({
            ...props,
            map,
            fitBounds: coordinates,
            fitBoundsParams,
            center,
            zoom,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_SHARE: {
          const controlInstance = new ShareControl({
            ...props,
            map,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_PATH: {
          const controlInstance = new PathControl({
            map,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_CUSTOM: {
          const { instance: CustomInstance, ...otherParams } = params;
          if (!CustomInstance) {
            return;
          }
          const controlInstance = new CustomInstance({
            ...props,
            ...otherParams,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_REPORT: {
          const controlInstance = new ReportControl({
            ...props,
            map,
            ...params,
          });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        case CONTROL_WIDGET: {
          const controlInstance = new WidgetControl({ ...props, map, ...params });
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);
          break;
        }
        default: {
          const controlInstance = typeof control === 'string'
            ? new mapBoxGl[control]({ ...params })
            : control;
          const { disabled } = params;
          this.controls.push(controlInstance);
          map.addControl(controlInstance, position);

          const { _container: container } = controlInstance;

          if (disabled && container) {
            container.classList.add('mapboxgl-ctrl--disabled');
          }
        }
      }
      map.fire(`control_${getControlName(control)}_added`);
      map.fire('control_added', { control });
    });
  }

  render () {
    return null;
  }
}

export default MapComponent;
