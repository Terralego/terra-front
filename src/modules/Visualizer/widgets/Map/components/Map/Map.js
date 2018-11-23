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
    displayScaleControl: PropTypes.bool,
    displayNavigationControl: PropTypes.bool,
    displayAttributionControl: PropTypes.bool,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
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

  async initMapProperties () {
    const {
      map,
      accessToken,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
    } = this.props;

    mapBoxGl.accessToken = accessToken;

    if (displayScaleControl && !this.displayScaleControl) {
      this.scaleControl = new mapBoxGl.ScaleControl();
      map.addControl(this.scaleControl);
    }

    if (displayNavigationControl && !this.displayNavigationControl) {
      this.navigationControl = new mapBoxGl.NavigationControl();
      map.addControl(this.navigationControl);
    }

    if (displayAttributionControl && !this.displayAttributionControl) {
      this.attributionControl = new mapBoxGl.AttributionControl();
      map.addControl(this.attributionControl);
    }

    this.addClickListeners();
  }

  updateFlyTo = (prevFlyTo, flyTo) => {
    if (prevFlyTo !== flyTo) {
      this.props.map.flyTo(flyTo);
    }
  }

  updateMapProperties = prevProps => {
    const {
      map,
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
      map.setMaxBounds(maxBounds);
    }

    if (prevProps.maxZoom !== maxZoom) {
      map.setMaxZoom(maxZoom);
    }

    if (prevProps.minZoom !== minZoom) {
      map.setMinZoom(minZoom);
    }

    if (prevProps.mapStyle !== mapStyle) {
      map.setStyle(mapStyle);
    }

    if (displayScaleControl !== prevProps.displayScaleControl) {
      if (displayScaleControl) {
        this.scaleControl = new mapBoxGl.ScaleControl();
        map.addControl(this.scaleControl);
      } else {
        map.removeControl(this.scaleControl);
      }
    }

    if (displayNavigationControl !== prevProps.displayNavigationControl) {
      if (displayNavigationControl) {
        this.navigationControl = new mapBoxGl.NavigationControl();
        map.addControl(this.navigationControl);
      } else {
        map.removeControl(this.navigationControl);
      }
    }


    if (displayAttributionControl !== prevProps.displayAttributionControl) {
      if (displayAttributionControl) {
        this.attributionControl = new mapBoxGl.AttributionControl();
        map.addControl(this.attributionControl);
      } else {
        map.removeControl(this.attributionControl);
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
    const { map, stylesToApply: { layouts = [] } = {} } = this.props;

    layouts.forEach(({ id, ...properties }) => {
      Object.keys(properties).forEach(property => {
        switch (property) {
          case 'paint':
            this.updatePaintProperties(id, properties[property]);
            break;
          default:
            map.setLayoutProperty(id, property, properties[property]);
        }
      });
    });
  }

  updatePaintProperties (id, properties) {
    Object.keys(properties).forEach(property => {
      try {
        this.props.map.setPaintProperty(id, property, properties[property]);
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
    this.props.map.getStyle().layers.map(({ id }) =>
      this.clickListeners.push(this.props.map.on('click', id, e => onClick(id, e.features, e))));
  }

  displayTooltip () {
    const { displayTooltip } = this.props;
    if (!displayTooltip) return;
    const { coordinates, content: description } = displayTooltip;

    new mapBoxGl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(this.props.map);
  }

  reset () {
    return new Promise(resolve => {
      this.props.map.once('data', resolve);
      this.props.map.setStyle(this.props.style);
    });
  }

  render () {
    return null;
  }
}

export default Map;
