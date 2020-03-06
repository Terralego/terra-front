import React from 'react';
import PropTypes from 'prop-types';
import mapBoxGl from 'mapbox-gl';
import { addMapDebug } from '../helpers/mapDebug';

import 'mapbox-gl/dist/mapbox-gl.css';

export const DEFAULT_LAYER_TYPES_WEIGHT = {
  background: 100,
  raster: 200,
  hillshade: 300,
  fill: 400,
  line: 500,
  heatmap: 600,
  'fill-extrusion': 700,
  circle: 800,
  symbol: 900,
};

/**
 * A wrapper around mapbox Map object to add ability to handle weighted insertion layer
 */
export class WeigthedMapProxy {
  constructor ({ map, layerTypesWeight = DEFAULT_LAYER_TYPES_WEIGHT }) {
    this.map = map;
    this.typesWeigth = layerTypesWeight;
    this.weights = {};
  }

  /**
   * Initialize weight for every auto loaded layer from background style.
   */
  initBaseStyleWeight () {
    let prevWeight = 0;
    const { layers } = this.map.getStyle();

    // Compute weigth map for each layer
    layers.reduce((acc, { type, id }, index) => {
      if (index < layers.length - 1) {
        const { type: nextType } = layers[index + 1];
        // if the layer is beetween two layers with same weight, the layer get the same weight
        if (this.typesWeigth[nextType] === prevWeight) {
          acc[id] = prevWeight;
          return acc;
        }
      }
      prevWeight = this.typesWeigth[type];
      acc[id] = this.typesWeigth[type];
      return acc;
    }, this.weights);
  }

  /**
   * Search for the first layer with bigger weight and return his id.
   * Undefined if never found.
   * @param {object} layers to search in
   * @param {int} weight to find
   * @returns The found layer id
   */
  getLayerIdWithBiggerWeight (layers, weight) {
    const isDrawLayer = layer => layer.id.startsWith('gl-draw');
    const validLayers = layers.filter(layer => !isDrawLayer(layer));

    for (let i = 0; i < validLayers.length; i += 1) {
      if (this.weights[validLayers[i].id] > weight) {
        return validLayers[i].id;
      }
    }
    return undefined;
  }

  /**
   * Return props from this object if exists otherwise from original map object
   * @param {*} obj instance of proxified object
   * @param {*} prop prop being accessed
   */
  get (obj, prop) {
    if (prop in this) {
      return this[prop];
    }
    return obj[prop];
  }

  /**
   * Replace mapbox addlayer to sort layer by weight. For each layer type,
   * a weight is associated. This weight is used unless the layer has an height property.
   * In this case the weight became the property. Allow user to sort layer as he wants to.
   * @param {*} layer the layer to be added
   * @param {*} beforeId if beforeId is set, the weight is ignored.
   */
  addLayer (layer, beforeId) {
    const { type, id, weight: layerWeight } = layer;
    const weight = layerWeight || this.typesWeigth[type];

    if (!beforeId) {
      // eslint-disable-next-line no-param-reassign
      beforeId = this.getLayerIdWithBiggerWeight(
        this.map.getStyle().layers,
        weight,
      );
      this.weights[id] = weight;
    } else {
      this.weights[id] = this.weights[beforeId];
    }

    this.map.addLayer(layer, beforeId);
  }

  removeLayer (layer) {
    this.weights[layer.id] = undefined;
    this.map.removeLayer(layer);
  }
}

export const withMap = WrappedComponent => {
  class WithMap extends React.Component {
    static propTypes = {
      backgroundStyle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          // See mapboxgl style API
          // https://www.mapbox.com/mapbox-gl-js/style-spec/
        }),
      ]).isRequired,
      zoom: PropTypes.number,
      fitBounds: PropTypes.shape({
        coordinates: PropTypes.arrayOf(
          PropTypes.array,
        ),
        padding: PropTypes.shape({
          top: PropTypes.number,
          bottom: PropTypes.number,
          left: PropTypes.number,
          right: PropTypes.number,
        }),
        offset: PropTypes.arrayOf(
          PropTypes.number,
        ),
      }),
      onMapInit: PropTypes.func,
      onMapLoaded: PropTypes.func,
      onMapUpdate: PropTypes.func,
      locale: PropTypes.shape({}),
      layerTypesWeight: PropTypes.shape({}),
    };

    static defaultProps = {
      zoom: 9,
      fitBounds: null,
      onMapInit () {},
      onMapLoaded () {},
      onMapUpdate () {},
      locale: {},
      layerTypesWeight: DEFAULT_LAYER_TYPES_WEIGHT,
    };

    state = {
      map: null,
    };

    containerEl = React.createRef();

    componentDidMount () {
      this.initMap();
    }

    componentWillUnmount () {
      this.isUnmount = true;
    }

    get map () {
      const { map } = this.state;
      return map;
    }

    initMap () {
      const {
        accessToken,
        backgroundStyle: style,
        center,
        zoom,
        maxZoom,
        minZoom,
        maxBounds,
        fitBounds,
        onMapInit,
        onMapLoaded,
        hash,
        locale,
        layerTypesWeight,
      } = this.props;

      mapBoxGl.accessToken = accessToken;

      const hasHash = hash && !!global.location.hash;

      const rawMap = new mapBoxGl.Map({
        container: this.containerEl.current,
        attributionControl: false,
        style,
        center,
        zoom,
        maxZoom,
        minZoom,
        maxBounds,
        // below fix Firefox bug for printing http://fuzzytolerance.info/blog/2016/07/01/Printing-Mapbox-GL-JS-maps-in-Firefox/
        preserveDrawingBuffer: navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
        hash,
        locale,
      });

      const map = new Proxy(rawMap, new WeigthedMapProxy({ map: rawMap, layerTypesWeight }));

      // This allows accessing MapboxGL instance from console (needed for e2e tests)
      if (this.containerEl.current) {
        this.containerEl.current.mapboxInstance = map;
      }

      if (!hasHash && fitBounds) {
        const { coordinates, ...fitBoundsParams } = fitBounds;
        map.fitBounds(coordinates, fitBoundsParams);
      }

      map.once('style.load', () => {
        if (this.isUnmount) return;

        map.initBaseStyleWeight();

        this.setState({ map });
        onMapLoaded(map);
      });

      addMapDebug(map);
      onMapInit(map);
    }

    render () {
      const { className, ...props } = this.props;
      const { map } = this.state;

      return (
        <div
          ref={this.containerEl}
          className={`tf-map ${className}`}
        >
          {map &&
            <WrappedComponent map={map} {...props} />
          }
        </div>
      );
    }
  }
  const name = WrappedComponent.displayName || WrappedComponent.name;
  WithMap.displayName = `withMap(${name})`;

  return WithMap;
};

export default withMap;
