import React from 'react';
import mapBoxGl from 'mapbox-gl';
import PropTypes from 'prop-types';
import 'mapbox-gl/dist/mapbox-gl.css';
import styles from './Map.css';

class Map extends React.Component {
  componentDidMount () {
    this.initMapProperties();
  }

  componentDidUpdate (prevProps) {
    this.updateMapProperties(prevProps);
  }

  initMapProperties () {
    const {
      accessToken,
      mapStyle,
      scaleControl,
      navigationControl,
      attributionControl,
      maxZoom,
      minZoom,
      zoom,
      maxBounds,
      mapRef,
    } = this.props;

    mapBoxGl.accessToken = accessToken;
    this.map = new mapBoxGl.Map({
      attributionControl: false,
      container: mapRef,
      style: mapStyle,
      center: [2, 47],
      zoom,
      maxZoom,
      minZoom,
      maxBounds,
      bearing: 0,
    });
    if (scaleControl && !this.scaleControl) {
      this.control = new mapBoxGl.ScaleControl();
      this.map.addControl(this.control);
    }

    if (navigationControl && !this.navigationControl) {
      this.navigationControl = new mapBoxGl.NavigationControl();
      this.map.addControl(this.navigationControl);
    }

    if (attributionControl && !this.attributionControl) {
      this.attributionControl = new mapBoxGl.AttributionControl();
      this.map.addControl(this.attributionControl);
    }
  }

  updateMapProperties = prevProps => {
    const {
      maxZoom,
      mapStyle,
      scaleControl,
      navigationControl,
      attributionControl,
      minZoom,
      maxBounds,
      flyTo,
    } = this.props;

    if (JSON.stringify(prevProps.flyTo) !== JSON.stringify(flyTo)) {
      this.map.flyTo(flyTo);
    }

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

    if (scaleControl && scaleControl !== prevProps.scaleControl) {
      this.scaleControl = new mapBoxGl.ScaleControl();
      this.map.addControl(this.scaleControl);
    }

    if (!scaleControl && scaleControl !== prevProps.scaleControl) {
      this.map.removeControl(this.control);
    }

    if (navigationControl && navigationControl !== prevProps.navigationControl) {
      this.navigationControl = new mapBoxGl.NavigationControl();
      this.map.addControl(this.navigationControl);
    }

    if (!navigationControl && navigationControl !== prevProps.navigationControl) {
      this.map.removeControl(this.navigationControl);
    }

    if (attributionControl && attributionControl !== prevProps.attributionControl) {
      this.attributionControl = new mapBoxGl.AttributionControl();
      this.map.addControl(this.attributionControl);
    }

    if (!attributionControl && attributionControl !== prevProps.attributionControl) {
      this.map.removeControl(this.attributionControl);
    }
  }

  render () {
    const { mapRef } = this.props;
    return (
      <div id={mapRef} className={styles.map} />
    );
  }
}

Map.propTypes = {
  accessToken: PropTypes.string.isRequired,
  mapRef: PropTypes.string.isRequired,
  mapStyle: PropTypes.string,
  scaleControl: PropTypes.bool,
  navigationControl: PropTypes.bool,
  attributionControl: PropTypes.bool,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  zoom: PropTypes.number,
  maxBounds: PropTypes.arrayOf(PropTypes.array),
  flyTo: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    speed: PropTypes.number,
    curve: PropTypes.number,
    easing: PropTypes.func,
  }),
};

Map.defaultProps = {
  mapStyle: 'mapbox://styles/mapbox/light-v9',
  scaleControl: true,
  navigationControl: true,
  attributionControl: true,
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
};

export default Map;
