import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';

import { StylesToApplyProps } from '../../../../propTypes/LayersTreePropTypes';

import './Map.scss';

export class Map extends React.Component {
  static propTypes = {
    // Mapbox general config
    accessToken: PropTypes.string.isRequired,
    styles: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        // See mapboxgl style API
        // https://www.mapbox.com/mapbox-gl-js/style-spec/
      }),
    ]).isRequired,
    displayScaleControl: PropTypes.bool,
    displayNavigationControl: PropTypes.bool,
    displayAttributionControl: PropTypes.bool,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    zoom: PropTypes.number,
    maxBounds: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.array), PropTypes.bool]),

    // Action to fly out to coordinates
    flyTo: PropTypes.shape({
      center: PropTypes.arrayOf(PropTypes.number),
      zoom: PropTypes.number,
      speed: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      curve: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
      easing: PropTypes.func,
    }),

    // Way to give order to map to apply new styles
    stylesToApply: StylesToApplyProps,

    onClick: PropTypes.func,

    displayTooltip: PropTypes.shape({
      coordinates: PropTypes.array,
      content: PropTypes.string,
    }),
  };

  static defaultProps = {
    displayScaleControl: true,
    displayNavigationControl: true,
    displayAttributionControl: true,
    maxZoom: 20,
    minZoom: 0,
    zoom: 9,
    maxBounds: false,
    flyTo: {
      center: [0, 0],
      zoom: 7,
      speed: false,
      curve: false,
      easing: () => {},
    },
    stylesToApply: {},
    onClick () {},
    displayTooltip: null,
  };

  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  clickListeners = [];
  containerEl = React.createRef();

  async createMap (params) {
    return new Promise(resolve => {
      this.map = new mapBoxGl.Map(params);
      this.map.once('data', () => resolve(this.map));
    });
  }

  async initMapProperties () {
    const {
      accessToken,
      styles: style,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
      maxZoom,
      minZoom,
      zoom,
      maxBounds,
      center,
    } = this.props;

    mapBoxGl.accessToken = accessToken;
    await this.createMap({
      attributionControl: false,
      container: this.containerEl.current,
      style,
      center,
      zoom,
      maxZoom,
      minZoom,
      maxBounds,
      bearing: 0,
    });

    if (displayScaleControl && !this.scaleControl) {
      this.scaleControl = new mapBoxGl.ScaleControl();
      this.map.addControl(this.scaleControl);
    }

    if (displayNavigationControl && !this.navigationControl) {
      this.navigationControl = new mapBoxGl.NavigationControl();
      this.map.addControl(this.navigationControl);
    }

    if (displayAttributionControl && !this.attributionControl) {
      this.attributionControl = new mapBoxGl.AttributionControl();
      this.map.addControl(this.attributionControl);
    }

    this.addClickListeners();
  }

  updateFlyTo = (prevFlyTo, flyTo) => {
    if (prevFlyTo !== flyTo) {
      this.map.flyTo(flyTo);
    }
  }

  updateMapProperties = prevProps => {
    const {
      maxZoom,
      mapStyle,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
      minZoom,
      maxBounds,
      flyTo,
      stylesToApply,
      onClick,
      displayTooltip,
    } = this.props;

    this.updateFlyTo(prevProps.flyTo, flyTo);

    if (prevProps.maxBounds !== maxBounds) {
      this.map.setMaxBounds(maxBounds);
    }

    if (prevProps.maxZoom !== maxZoom) {
      this.map.setMaxZoom(maxZoom);
    }

    if (prevProps.minZoom !== minZoom) {
      this.map.setMinZoom(minZoom);
    }

    if (prevProps.mapStyle !== mapStyle) {
      this.map.setStyle(mapStyle);
    }

    if (displayScaleControl !== prevProps.displayScaleControl) {
      if (displayScaleControl) {
        this.scaleControl = new mapBoxGl.ScaleControl();
        this.map.addControl(this.scaleControl);
      } else {
        this.map.removeControl(this.scaleControl);
      }
    }

    if (displayNavigationControl !== prevProps.displayNavigationControl) {
      if (displayNavigationControl) {
        this.navigationControl = new mapBoxGl.NavigationControl();
        this.map.addControl(this.navigationControl);
      } else {
        this.map.removeControl(this.navigationControl);
      }
    }


    if (displayAttributionControl !== prevProps.displayAttributionControl) {
      if (displayAttributionControl) {
        this.attributionControl = new mapBoxGl.AttributionControl();
        this.map.addControl(this.attributionControl);
      } else {
        this.map.removeControl(this.attributionControl);
      }
    }

    if (onClick !== prevProps.onClick) {
      this.addClickListeners();
    }

    if (stylesToApply !== prevProps.stylesToApply) {
      this.applyNewStyles();
    }

    if (displayTooltip !== prevProps.displayTooltip) {
      this.displayTooltip();
    }
  }

  applyNewStyles () {
    const { stylesToApply: { layouts = [] } = {} } = this.props;

    layouts.forEach(({ id, ...properties }) => {
      Object.keys(properties).forEach(property => {
        switch (property) {
          case 'paint':
            this.updatePaintProperties(id, properties[property]);
            break;
          default:
            this.map.setLayoutProperty(id, property, properties[property]);
        }
      });
    });
  }

  updatePaintProperties (id, properties) {
    Object.keys(properties).forEach(property => {
      try {
        this.map.setPaintProperty(id, property, properties[property]);
      } catch (e) {
        //
      }
    });
  }

  addClickListeners () {
    const { onClick } = this.props;
    this.clickListeners.forEach(listener => {
      listener();
    });
    this.map.getStyle().layers.map(({ id }) =>
      this.clickListeners.push(this.map.on('click', id, e => onClick(id, e.features, e))));
  }

  displayTooltip () {
    const { displayTooltip } = this.props;
    if (!displayTooltip) return;
    const { coordinates, content: description } = displayTooltip;

    new mapBoxGl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(this.map);
  }

  reset () {
    return new Promise(resolve => {
      this.map.once('data', resolve);
      this.map.setStyle(this.props.style);
    });
  }

  render () {
    return (
      <div ref={this.containerEl} className="tf-map" />
    );
  }
}

export default Map;
