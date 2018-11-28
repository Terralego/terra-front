import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';

import log from '../../../../services/log';
import { StylesToApplyProps } from '../../../../propTypes/LayersTreePropTypes';

import './Map.scss';

export class Map extends React.Component {
  static propTypes = {
    // Mapbox general config
    accessToken: PropTypes.string,
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

    displayPointerOnLayers: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    accessToken: '',
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
    displayPointerOnLayers: [],
  };

  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  mapListeners = [];

  async initMapProperties () {
    const {
      accessToken,
      displayScaleControl,
      displayNavigationControl,
      displayAttributionControl,
    } = this.props;

    mapBoxGl.accessToken = accessToken;

    this.toggleDisplayScaleControl(displayScaleControl);

    this.toggleNavigationControl(displayNavigationControl);

    this.toggleAttributionControl(displayAttributionControl);

    this.addClickListeners();
  }

  toggleAttributionControl (display) {
    const { map } = this.props;
    if (this.attributionControl && !display) {
      map.removeControl(this.attributionControl);
      delete this.attributionControl;
    }
    if (display) {
      if (this.attributionControl) {
        map.removeControl(this.attributionControl);
      }
      this.attributionControl = new mapBoxGl.AttributionControl();
      map.addControl(this.attributionControl);
    }
  }

  toggleNavigationControl (display) {
    const { map } = this.props;
    if (this.navigationControl && !display) {
      map.removeControl(this.navigationControl);
      delete this.navigationControl;
    }
    if (display) {
      if (this.navigationControl) {
        map.removeControl(this.navigationControl);
      }
      this.navigationControl = new mapBoxGl.NavigationControl();
      map.addControl(this.navigationControl);
    }
  }

  toggleDisplayScaleControl (display) {
    const { map } = this.props;
    if (this.scaleControl && !display) {
      map.removeControl(this.scaleControl);
      delete this.scaleControl;
    }
    if (display) {
      if (this.scaleControl) {
        map.removeControl(this.scaleControl);
      }
      this.scaleControl = new mapBoxGl.ScaleControl();
      map.addControl(this.scaleControl);
    }
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
      this.toggleDisplayScaleControl(displayScaleControl);
    }

    if (displayNavigationControl !== prevProps.displayNavigationControl) {
      this.toggleNavigationControl(displayNavigationControl);
    }


    if (displayAttributionControl !== prevProps.displayAttributionControl) {
      this.toggleAttributionControl(displayAttributionControl);
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
          case 'filter':
            this.updateFilter(id, properties[property]);
            break;
          default:
            map.setLayoutProperty(id, property, properties[property]);
        }
      });
    });
  }

  updatePaintProperties (id, properties) {
    const { map } = this.props;
    Object.keys(properties).forEach(property => {
      try {
        map.setPaintProperty(id, property, properties[property]);
      } catch (e) {
        //
      }
    });
  }

  updateFilter (id, filter) {
    const { map } = this.props;
    map.setFilter(id, filter);
  }

  addClickListeners () {
    const { onClick, map, displayPointerOnLayers } = this.props;
    this.mapListeners.forEach(listener => {
      listener();
    });
    map.getStyle().layers.forEach(({ id }) => {
      const clickListener = map.on('click', id, e => {
        log('map clicked', id, e.features, e);
        onClick(id, e.features, e);
      });
      this.mapListeners.push(clickListener);

      if (displayPointerOnLayers.includes(id)) {
        const mouseenterListener = map.on('mouseenter', id, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        const mouseleaveListener = map.on('mouseleave', id, () => {
          map.getCanvas().style.cursor = '';
        });
        this.mapListeners.push(mouseenterListener);
        this.mapListeners.push(mouseleaveListener);
      }
    });
  }

  displayTooltip () {
    const { displayTooltip } = this.props;
    if (!displayTooltip) return;
    const { coordinates, content: description, container } = displayTooltip;

    const popup = new mapBoxGl.Popup();
    popup.setLngLat(coordinates);
    if (container) {
      popup.setDOMContent(container);
    }
    if (description) {
      popup.setHTML(description);
    }
    popup.addTo(this.props.map);
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
